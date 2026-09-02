// play-kit/src/core/Camera.tsx

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
  /** Field of view (perspective) or frustum size (orthographic) */
  fov?: number;
  /** Aspect ratio (width/height) */
  aspect?: number;
  /** Near clipping plane */
  near?: number;
  /** Far clipping plane */
  far?: number;
  /** Camera position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Target to look at as [x, y, z] or Vector3 */
  lookAt?: [number, number, number] | THREE.Vector3;
  /** If true, use OrthographicCamera; otherwise PerspectiveCamera */
  orthographic?: boolean;

  // Events
  onChange?: (camera: THREE.Camera) => void;
  onUpdate?: (camera: THREE.Camera) => void;
}

const Camera = forwardRef<THREE.Camera, CameraProps>(
  (
    {
      fov = 75,
      aspect = 1,
      near = 0.1,
      far = 1000,
      position = [0, 0, 5],
      lookAt = [0, 0, 0],
      orthographic = false,
      onChange,
      onUpdate,
    },
    ref,
  ) => {
    const [active, setActive] = useState<boolean>(true);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const animFrameRef = useRef<number | null>(null);

    // Stabilize onChange handler
    const handleChange = useCallback(
      (camera: THREE.Camera) => {
        if (onChange) onChange(camera);
      },
      [onChange],
    );

    // Create camera instance when orthographic mode changes
    useEffect(() => {
      let cam: THREE.Camera;
      if (orthographic) {
        // Compute frustum size from fov (treat as vertical FOV) and near plane
        const halfHeight = Math.tan((fov * Math.PI) / 360) * near;
        const halfWidth = halfHeight * aspect;
        cam = new THREE.OrthographicCamera(
          -halfWidth,
          halfWidth,
          halfHeight,
          -halfHeight,
          near,
          far,
        );
      } else {
        cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
      }

      cameraRef.current = cam;
      setActive(true);
      handleChange(cam);

      return () => {
        // No explicit disposal needed, but cleanup ref
        cameraRef.current = null;
      };
      // Only recreate when orthographic toggles; other props updated via separate effects
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orthographic]); // we intentionally omit fov, aspect, etc. because they are handled by update effects

    // Update camera properties when props change (except position/lookAt)
    useEffect(() => {
      const cam = cameraRef.current;
      if (!cam) return;

      if (!orthographic && cam instanceof THREE.PerspectiveCamera) {
        cam.fov = fov;
        cam.aspect = aspect;
        cam.near = near;
        cam.far = far;
        cam.updateProjectionMatrix();
        handleChange(cam);
      } else if (orthographic && cam instanceof THREE.OrthographicCamera) {
        const halfHeight = Math.tan((fov * Math.PI) / 360) * near;
        const halfWidth = halfHeight * aspect;
        cam.left = -halfWidth;
        cam.right = halfWidth;
        cam.top = halfHeight;
        cam.bottom = -halfHeight;
        cam.near = near;
        cam.far = far;
        cam.updateProjectionMatrix();
        handleChange(cam);
      }
    }, [fov, aspect, near, far, orthographic, handleChange]);

    // Update position and lookAt
    useEffect(() => {
      const cam = cameraRef.current;
      if (!cam) return;

      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      cam.position.copy(pos);

      const target = Array.isArray(lookAt)
        ? new THREE.Vector3(...lookAt)
        : lookAt;
      cam.lookAt(target);

      handleChange(cam);
    }, [position, lookAt, handleChange]);

    // Animation loop for onUpdate
    useEffect(() => {
      if (!onUpdate) return;

      const loop = () => {
        if (cameraRef.current) {
          onUpdate(cameraRef.current);
        }
        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      };
    }, [onUpdate]);

    useImperativeHandle(ref, () => cameraRef.current as THREE.Camera);

    return null;
  },
);

Camera.displayName = "Camera";

export default Camera;
