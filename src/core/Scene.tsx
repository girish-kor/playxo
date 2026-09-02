// play-kit/src/core/Scene.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface SceneProps {
  /** Background color, texture, or Color */
  background?: string | number | THREE.Color | THREE.Texture;
  /** Fog (Fog or FogExp2) */
  fog?: THREE.Fog | THREE.FogExp2;
  /** Whether to automatically update matrices (default: true) */
  autoUpdate?: boolean;
  /** Child elements (3D objects, lights, etc.) */
  children?: React.ReactNode;

  /** Called when scene is ready */
  onReady?: (scene: THREE.Scene) => void;
  /** Called each frame while active */
  onUpdate?: (scene: THREE.Scene, delta: number) => void;
  /** Called before rendering */
  onBeforeRender?: (scene: THREE.Scene) => void;
  /** Called after rendering */
  onAfterRender?: (scene: THREE.Scene) => void;

  /** Whether the scene is active (enables onUpdate loop) */
  active?: boolean;

  /** Accessibility label */
  "aria-label"?: string;
}

export interface SceneRef {
  /** The underlying Three.js Scene */
  scene: THREE.Scene | null;
  /** Whether the scene is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event (triggers onUpdate) */
  update: () => void;
}

const Scene = forwardRef<SceneRef, SceneProps>(
  (
    {
      background,
      fog,
      autoUpdate = true,
      children,
      onReady,
      onUpdate,
      onBeforeRender,
      onAfterRender,
      active = true,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    // Internal states
    const [isActive, setIsActive] = useState<boolean>(active);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRendering, setIsRendering] = useState<boolean>(false);

    // Refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    // Stabilize callbacks
    const handleReady = useCallback(
      (scene: THREE.Scene) => {
        if (onReady) onReady(scene);
      },
      [onReady],
    );

    const handleUpdate = useCallback(
      (scene: THREE.Scene, delta: number) => {
        if (onUpdate) onUpdate(scene, delta);
      },
      [onUpdate],
    );

    const handleBeforeRender = useCallback(
      (scene: THREE.Scene) => {
        if (onBeforeRender) onBeforeRender(scene);
      },
      [onBeforeRender],
    );

    const handleAfterRender = useCallback(
      (scene: THREE.Scene) => {
        if (onAfterRender) onAfterRender(scene);
      },
      [onAfterRender],
    );

    // Create the scene
    useEffect(() => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      setIsLoading(false);
      setIsReady(true);
      handleReady(scene);
      setIsActive(active);

      return () => {
        // Dispose resources? Scene disposal is manual; we'll just nullify.
        sceneRef.current = null;
        setIsReady(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only once

    // Sync background
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      if (background instanceof THREE.Texture) {
        scene.background = background;
      } else if (background !== undefined) {
        scene.background = new THREE.Color(background);
      } else {
        scene.background = null;
      }
    }, [background]);

    // Sync fog
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.fog = fog || null;
    }, [fog]);

    // Sync autoUpdate
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.autoUpdate = autoUpdate;
    }, [autoUpdate]);

    // Accessibility
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.userData["aria-label"] = ariaLabel || "";
    }, [ariaLabel]);

    // Active state sync
    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Animation loop for onUpdate
    useEffect(() => {
      if (!onUpdate && !onBeforeRender && !onAfterRender) return;
      if (!isActive) return;

      const loop = (time: number) => {
        const scene = sceneRef.current;
        if (scene) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          setIsRendering(true);
          handleBeforeRender(scene);
          handleUpdate(scene, delta);
          handleAfterRender(scene);
          setIsRendering(false);
        }
        animFrameRef.current = requestAnimationFrame(loop);
      };

      prevTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      };
    }, [
      isActive,
      onUpdate,
      onBeforeRender,
      onAfterRender,
      handleUpdate,
      handleBeforeRender,
      handleAfterRender,
    ]);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        scene: sceneRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const scene = sceneRef.current;
          if (scene) {
            // Trigger update callback manually
            const now = performance.now();
            const delta = now - prevTimeRef.current;
            prevTimeRef.current = now;
            handleUpdate(scene, delta);
          }
        },
      }),
      [isActive, handleUpdate],
    );

    // This component renders nothing; the scene is managed via refs.
    return null;
  },
);

Scene.displayName = "Scene";

export default Scene;
