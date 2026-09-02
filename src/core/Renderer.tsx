// playxo/src/core/Renderer.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface RendererProps {
  /** Whether to enable antialiasing (default: true) */
  antialias?: boolean;
  /** Whether to enable shadows (default: false) */
  shadows?: boolean;
  /** Pixel ratio (default: window.devicePixelRatio) */
  pixelRatio?: number;
  /** Size of the renderer (width/height) */
  size?: { width: number; height: number };
  /** Tone mapping (default: THREE.NoToneMapping) */
  toneMapping?: THREE.ToneMapping;
  /** Scene to render (must be provided) */
  scene?: THREE.Scene;
  /** CSS style for the canvas */
  style?: React.CSSProperties;
  /** Accessibility label */
  "aria-label"?: string;

  /** Called when the canvas resizes */
  onResize?: (width: number, height: number) => void;
  /** Called each frame after rendering */
  onRender?: (renderer: THREE.WebGLRenderer) => void;
  /** Called when WebGL context is lost */
  onContextLost?: (event: Event) => void;

  /** Whether the renderer is active (renders each frame) */
  active?: boolean;
}

export interface RendererRef {
  /** The underlying Three.js WebGLRenderer */
  renderer: THREE.WebGLRenderer | null;
  /** The canvas DOM element */
  canvas: HTMLCanvasElement | null;
  /** Whether the renderer is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force a render call */
  render: () => void;
  /** Set the scene to render */
  setScene: (scene: THREE.Scene) => void;
}

const Renderer = forwardRef<RendererRef, RendererProps>(
  (
    {
      antialias = true,
      shadows = false,
      pixelRatio,
      size,
      toneMapping = THREE.NoToneMapping,
      scene,
      style,
      "aria-label": ariaLabel = "3D Renderer",
      onResize,
      onRender,
      onContextLost,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [currentScene, setCurrentScene] = useState<THREE.Scene | undefined>(
      scene,
    );

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animFrameRef = useRef<number | null>(null);

    // Stabilize callbacks
    const handleResize = useCallback(
      (width: number, height: number) => {
        if (onResize) onResize(width, height);
      },
      [onResize],
    );

    const handleRender = useCallback(
      (renderer: THREE.WebGLRenderer) => {
        if (onRender) onRender(renderer);
      },
      [onRender],
    );

    const handleContextLost = useCallback(
      (event: Event) => {
        if (onContextLost) onContextLost(event);
      },
      [onContextLost],
    );

    // Create renderer and attach to canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha: true,
      });
      renderer.shadowMap.enabled = shadows;
      if (pixelRatio !== undefined) {
        renderer.setPixelRatio(pixelRatio);
      } else {
        renderer.setPixelRatio(window.devicePixelRatio);
      }
      renderer.toneMapping = toneMapping;

      // Set size
      const width = size?.width || canvas.clientWidth || 300;
      const height = size?.height || canvas.clientHeight || 150;
      renderer.setSize(width, height, false);

      rendererRef.current = renderer;

      // Handle context loss
      const onContextLostHandler = (event: Event) => {
        handleContextLost(event);
      };
      canvas.addEventListener("webglcontextlost", onContextLostHandler);

      return () => {
        canvas.removeEventListener("webglcontextlost", onContextLostHandler);
        renderer.dispose();
        rendererRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [antialias, shadows, toneMapping, pixelRatio]); // recreate when these change

    // Sync size changes
    useEffect(() => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      if (!size) return;
      renderer.setSize(size.width, size.height, false);
      handleResize(size.width, size.height);
    }, [size, handleResize]);

    // Update shadows
    useEffect(() => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      renderer.shadowMap.enabled = shadows;
    }, [shadows]);

    // Update toneMapping
    useEffect(() => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      renderer.toneMapping = toneMapping;
    }, [toneMapping]);

    // Update pixel ratio
    useEffect(() => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      if (pixelRatio !== undefined) {
        renderer.setPixelRatio(pixelRatio);
      } else {
        renderer.setPixelRatio(window.devicePixelRatio);
      }
    }, [pixelRatio]);

    // Handle resize via ResizeObserver on canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const renderer = rendererRef.current;
          if (renderer) {
            renderer.setSize(width, height, false);
            handleResize(width, height);
          }
        }
      });
      observer.observe(canvas);
      return () => observer.disconnect();
    }, [handleResize]);

    // Active state sync
    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Render loop
    useEffect(() => {
      if (!isActive || !rendererRef.current) return;

      const renderLoop = () => {
        const renderer = rendererRef.current;
        const sceneToRender = currentScene || scene;
        if (renderer && sceneToRender) {
          renderer.render(sceneToRender, new THREE.Camera()); // Camera needed; will be set later
          handleRender(renderer);
        }
        animFrameRef.current = requestAnimationFrame(renderLoop);
      };

      animFrameRef.current = requestAnimationFrame(renderLoop);

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      };
    }, [isActive, currentScene, scene, handleRender]);

    // Update scene if prop changes
    useEffect(() => {
      setCurrentScene(scene);
    }, [scene]);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        renderer: rendererRef.current,
        canvas: canvasRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        render: () => {
          const renderer = rendererRef.current;
          const sceneToRender = currentScene || scene;
          if (renderer && sceneToRender) {
            renderer.render(sceneToRender, new THREE.Camera());
            handleRender(renderer);
          }
        },
        setScene: (scene: THREE.Scene) => {
          setCurrentScene(scene);
        },
      }),
      [isActive, currentScene, scene, handleRender],
    );

    return (
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", ...style }}
        aria-label={ariaLabel}
      />
    );
  },
);

Renderer.displayName = "Renderer";

export default Renderer;
