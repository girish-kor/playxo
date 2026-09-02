// play-kit/src/core/Scene.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import * as THREE from "three";

// Context for children to register themselves
export interface SceneContextValue {
  scene: THREE.Scene;
  addObject: (object: THREE.Object3D) => void;
  removeObject: (object: THREE.Object3D) => void;
}

export const SceneContext = createContext<SceneContextValue | null>(null);

export const useScene = (): SceneContextValue => {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useScene must be used within a Scene component");
  }
  return context;
};

export interface SceneProps {
  /** Background color (number, string, Color) or Texture */
  background?: THREE.ColorRepresentation | THREE.Texture;
  /** Fog instance (Fog or FogExp2) */
  fog?: THREE.Fog | THREE.FogExp2;
  /** Automatically update scene matrix (default: true) */
  autoUpdate?: boolean;
  /** Child nodes (3D objects, lights, cameras, helpers) */
  children?: ReactNode;

  // Events
  /** Called when the scene is ready */
  onReady?: (scene: THREE.Scene) => void;
  /** Called each frame while active */
  onUpdate?: (scene: THREE.Scene, delta: number) => void;
  /** Called before each render (in the animation loop) */
  onBeforeRender?: (scene: THREE.Scene) => void;
  /** Called after each render (in the animation loop) */
  onAfterRender?: (scene: THREE.Scene) => void;

  // State control
  /** Whether the scene is active (enables onUpdate and render callbacks) */
  active?: boolean;

  // Accessibility
  "aria-label"?: string;
}

export interface SceneRef {
  /** The underlying Three.js Scene */
  scene: THREE.Scene | null;
  /** Current ready state */
  ready: boolean;
  /** Current loading state */
  loading: boolean;
  /** Current rendering state */
  rendering: boolean;
  /** Add an object to the scene */
  add: (object: THREE.Object3D) => void;
  /** Remove an object from the scene */
  remove: (object: THREE.Object3D) => void;
  /** Set active state */
  setActive: (active: boolean) => void;
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
    const [loading, setLoading] = useState<boolean>(true);
    const [ready, setReady] = useState<boolean>(false);
    const [rendering, setRendering] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(active);

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

    // Create the scene instance
    useEffect(() => {
      const scene = new THREE.Scene();
      scene.matrixAutoUpdate = autoUpdate;

      // Apply initial background and fog
      if (background !== undefined) {
        if (
          typeof background === "object" &&
          (background as THREE.Texture).isTexture
        ) {
          scene.background = background as THREE.Texture;
        } else {
          scene.background = new THREE.Color(
            background as THREE.ColorRepresentation,
          );
        }
      }
      if (fog) {
        scene.fog = fog;
      }

      sceneRef.current = scene;

      // Set ready state
      setLoading(false);
      setReady(true);
      handleReady(scene);

      // Cleanup
      return () => {
        sceneRef.current = null;
        setReady(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only once on mount

    // Update background when prop changes
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      if (background !== undefined) {
        if (
          typeof background === "object" &&
          (background as THREE.Texture).isTexture
        ) {
          scene.background = background as THREE.Texture;
        } else {
          scene.background = new THREE.Color(
            background as THREE.ColorRepresentation,
          );
        }
      } else {
        scene.background = null;
      }
    }, [background]);

    // Update fog when prop changes
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.fog = fog || null;
    }, [fog]);

    // Update autoUpdate
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.matrixAutoUpdate = autoUpdate;
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

    // Animation loop for onUpdate and render callbacks
    useEffect(() => {
      if (!isActive) {
        // Stop loop if active becomes false
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        setRendering(false);
        return;
      }

      // Only run loop if any of the callbacks are provided
      if (!onUpdate && !onBeforeRender && !onAfterRender) {
        return;
      }

      const loop = (time: number) => {
        const scene = sceneRef.current;
        if (scene) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;

          if (onBeforeRender) handleBeforeRender(scene);
          if (onUpdate) handleUpdate(scene, delta);
          if (onAfterRender) handleAfterRender(scene);

          setRendering(true);
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
        setRendering(false);
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

    // Context value for children
    const contextValue: SceneContextValue = {
      scene: sceneRef.current!,
      addObject: (object: THREE.Object3D) => {
        if (sceneRef.current) {
          sceneRef.current.add(object);
        }
      },
      removeObject: (object: THREE.Object3D) => {
        if (sceneRef.current) {
          sceneRef.current.remove(object);
        }
      },
    };

    // Expose imperative methods and state via ref
    useImperativeHandle(
      ref,
      () => ({
        scene: sceneRef.current,
        ready,
        loading,
        rendering,
        add: (object: THREE.Object3D) => {
          if (sceneRef.current) sceneRef.current.add(object);
        },
        remove: (object: THREE.Object3D) => {
          if (sceneRef.current) sceneRef.current.remove(object);
        },
        setActive: (active: boolean) => {
          setIsActive(active);
        },
      }),
      [ready, loading, rendering],
    );

    // Provide context and render children
    return (
      <SceneContext.Provider value={contextValue}>
        {children}
      </SceneContext.Provider>
    );
  },
);

Scene.displayName = "Scene";

export default Scene;
