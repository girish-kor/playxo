// playxo/src/core/Camera.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface CameraProps {
  /** Field of view (for perspective) */
  fov?: number;
  /** Aspect ratio (width/height) */
  aspect?: number;
  /** Near clipping plane */
  near?: number;
  /** Far clipping plane */
  far?: number;
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Target to look at as [x, y, z] or Vector3 */
  lookAt?: [number, number, number] | THREE.Vector3;
  /** Whether to use orthographic projection (overrides variant) */
  orthographic?: boolean;
  /** Variant of the camera (default: 'perspective') */
  variant?: "perspective" | "orthographic" | "array";

  // Events
  /** Called whenever camera properties change */
  onChange?: (camera: THREE.Camera) => void;
  /** Called each frame while active */
  onUpdate?: (camera: THREE.Camera, delta: number) => void;

  // State
  /** Whether the camera is active (enables onUpdate loop) */
  active?: boolean;
  /** Accessibility label */
  "aria-label"?: string;
}

export interface CameraRef {
  /** The underlying Three.js Camera */
  camera: THREE.Camera | null;
  /** Whether the camera is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event (triggers onChange) */
  update: () => void;
}

const Camera = forwardRef<CameraRef, CameraProps>(
  (
    {
      fov = 75,
      aspect = 1,
      near = 0.1,
      far = 1000,
      position = [0, 0, 5],
      lookAt = [0, 0, 0],
      orthographic = false,
      variant = "perspective",
      onChange,
      onUpdate,
      active = true,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    // Internal states
    const [isActive, setIsActive] = useState<boolean>(active);

    // Refs
    const cameraRef = useRef<THREE.Camera | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    // Stabilize callbacks
    const handleChange = useCallback(
      (camera: THREE.Camera) => {
        if (onChange) onChange(camera);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (camera: THREE.Camera, delta: number) => {
        if (onUpdate) onUpdate(camera, delta);
      },
      [onUpdate],
    );

    // Create the camera instance when variant or orthographic changes
    useEffect(() => {
      let camera: THREE.Camera;

      // Determine actual variant: orthographic bool overrides variant
      const useOrthographic = orthographic || variant === "orthographic";
      const useArray = variant === "array";

      if (useArray) {
        // Create an ArrayCamera with a single default camera
        const subCam = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera = new THREE.ArrayCamera([subCam]);
        // Copy properties to the ArrayCamera itself (it inherits from PerspectiveCamera)
        // We'll set its properties manually below.
      } else if (useOrthographic) {
        // OrthographicCamera(left, right, top, bottom, near, far)
        // Use reasonable defaults based on aspect
        const halfHeight = 1; // arbitrary
        const halfWidth = halfHeight * aspect;
        camera = new THREE.OrthographicCamera(
          -halfWidth,
          halfWidth,
          halfHeight,
          -halfHeight,
          near,
          far,
        );
      } else {
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      }

      // Apply initial transforms
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      camera.position.copy(pos);

      // Apply lookAt
      const target = Array.isArray(lookAt)
        ? new THREE.Vector3(...lookAt)
        : lookAt;
      camera.lookAt(target);

      // Update projection matrix for perspective/orthographic cameras
      if (
        camera instanceof THREE.PerspectiveCamera ||
        camera instanceof THREE.OrthographicCamera
      ) {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = fov;
          camera.aspect = aspect;
        } else {
          const halfHeight = 1;
          const halfWidth = halfHeight * aspect;
          camera.left = -halfWidth;
          camera.right = halfWidth;
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
        }
        camera.updateProjectionMatrix();
      }

      cameraRef.current = camera;

      // Reset active state to prop
      setIsActive(active);

      // Call onChange initially
      handleChange(camera);

      return () => {
        cameraRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, orthographic]); // recreate only when variant/orthographic changes

    // Update properties when they change (without recreating camera)
    useEffect(() => {
      const camera = cameraRef.current;
      if (!camera) return;

      if (
        camera instanceof THREE.PerspectiveCamera ||
        camera instanceof THREE.OrthographicCamera
      ) {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = fov;
          camera.aspect = aspect;
        } else {
          const halfHeight = 1;
          const halfWidth = halfHeight * aspect;
          camera.left = -halfWidth;
          camera.right = halfWidth;
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
        }
        camera.updateProjectionMatrix();
        handleChange(camera);
      }
    }, [fov, aspect, handleChange]);

    // Update position
    useEffect(() => {
      const camera = cameraRef.current;
      if (!camera) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      camera.position.copy(pos);
      handleChange(camera);
    }, [position, handleChange]);

    // Update lookAt
    useEffect(() => {
      const camera = cameraRef.current;
      if (!camera) return;
      const target = Array.isArray(lookAt)
        ? new THREE.Vector3(...lookAt)
        : lookAt;
      camera.lookAt(target);
      handleChange(camera);
    }, [lookAt, handleChange]);

    // Update near/far (for both perspective and orthographic)
    useEffect(() => {
      const camera = cameraRef.current;
      if (!camera) return;
      // Both PerspectiveCamera and OrthographicCamera have near/far
      if (
        camera instanceof THREE.PerspectiveCamera ||
        camera instanceof THREE.OrthographicCamera
      ) {
        camera.near = near;
        camera.far = far;
        camera.updateProjectionMatrix();
        handleChange(camera);
      }
    }, [near, far, handleChange]);

    // Accessibility: set userData for aria-label
    useEffect(() => {
      const camera = cameraRef.current;
      if (!camera) return;
      camera.userData["aria-label"] = ariaLabel || "";
    }, [ariaLabel]);

    // Active state sync
    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Animation loop for onUpdate
    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const camera = cameraRef.current;
        if (camera) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(camera, delta);
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
    }, [onUpdate, isActive, handleUpdate]);

    // Expose imperative methods and state via ref
    useImperativeHandle(
      ref,
      () => ({
        camera: cameraRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const camera = cameraRef.current;
          if (camera) {
            if (
              camera instanceof THREE.PerspectiveCamera ||
              camera instanceof THREE.OrthographicCamera
            ) {
              camera.updateProjectionMatrix();
            }
            handleChange(camera);
          }
        },
      }),
      [isActive, handleChange],
    );

    // This component renders nothing; the camera is managed via refs.
    return null;
  },
);

Camera.displayName = "Camera";

export default Camera;
