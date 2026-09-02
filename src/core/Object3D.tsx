// play-kit/src/core/Object3D.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface Object3DProps {
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Rotation as Euler or [x, y, z] (order XYZ) */
  rotation?: [number, number, number] | THREE.Euler;
  /** Scale as [x, y, z] or Vector3 */
  scale?: [number, number, number] | THREE.Vector3;
  /** Quaternion as [x, y, z, w] or Quaternion */
  quaternion?: [number, number, number, number] | THREE.Quaternion;
  /** Whether the object is visible */
  visible?: boolean;

  /** Called when object properties change */
  onChange?: (object: THREE.Object3D) => void;
  /** Called each frame while active */
  onUpdate?: (object: THREE.Object3D, delta: number) => void;

  /** Whether the object is active (enables onUpdate loop) */
  active?: boolean;
}

export interface Object3DRef {
  /** The underlying Three.js Object3D */
  object: THREE.Object3D | null;
  /** Whether the object is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const Object3D = forwardRef<Object3DRef, Object3DProps>(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      quaternion,
      visible = true,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const objectRef = useRef<THREE.Object3D | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (object: THREE.Object3D) => {
        if (onChange) onChange(object);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (object: THREE.Object3D, delta: number) => {
        if (onUpdate) onUpdate(object, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const object = new THREE.Object3D();
      objectRef.current = object;
      setIsActive(active);

      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      object.position.copy(pos);
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      object.rotation.copy(rot);
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      object.scale.copy(sc);
      if (quaternion) {
        const q = Array.isArray(quaternion)
          ? new THREE.Quaternion(...quaternion)
          : quaternion;
        object.quaternion.copy(q);
      }
      object.visible = visible;

      handleChange(object);

      return () => {
        objectRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const object = objectRef.current;
      if (!object) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      object.position.copy(pos);
      handleChange(object);
    }, [position, handleChange]);

    useEffect(() => {
      const object = objectRef.current;
      if (!object) return;
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      object.rotation.copy(rot);
      handleChange(object);
    }, [rotation, handleChange]);

    useEffect(() => {
      const object = objectRef.current;
      if (!object) return;
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      object.scale.copy(sc);
      handleChange(object);
    }, [scale, handleChange]);

    useEffect(() => {
      const object = objectRef.current;
      if (!object) return;
      if (quaternion) {
        const q = Array.isArray(quaternion)
          ? new THREE.Quaternion(...quaternion)
          : quaternion;
        object.quaternion.copy(q);
      }
      handleChange(object);
    }, [quaternion, handleChange]);

    useEffect(() => {
      const object = objectRef.current;
      if (!object) return;
      object.visible = visible;
      handleChange(object);
    }, [visible, handleChange]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const object = objectRef.current;
        if (object) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(object, delta);
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

    useImperativeHandle(
      ref,
      () => ({
        object: objectRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const object = objectRef.current;
          if (object) {
            handleChange(object);
          }
        },
      }),
      [isActive, handleChange],
    );

    return null;
  },
);

Object3D.displayName = "Object3D";

export default Object3D;
