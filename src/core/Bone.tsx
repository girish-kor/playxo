// play-kit/src/core/Bone.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface BoneProps {
  /** Name of the bone */
  name?: string;
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Rotation as Euler or [x, y, z] (order XYZ) */
  rotation?: [number, number, number] | THREE.Euler;
  /** Scale as [x, y, z] or Vector3 */
  scale?: [number, number, number] | THREE.Vector3;
  /** Children bones */
  children?: React.ReactNode;

  /** Called when bone properties change */
  onChange?: (bone: THREE.Bone) => void;
  /** Called each frame while active */
  onUpdate?: (bone: THREE.Bone, delta: number) => void;

  /** Whether the bone is active (enables onUpdate loop) */
  active?: boolean;
}

export interface BoneRef {
  /** The underlying Three.js Bone */
  bone: THREE.Bone | null;
  /** Whether the bone is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const Bone = forwardRef<BoneRef, BoneProps>(
  (
    {
      name = "",
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      children,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const boneRef = useRef<THREE.Bone | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (bone: THREE.Bone) => {
        if (onChange) onChange(bone);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (bone: THREE.Bone, delta: number) => {
        if (onUpdate) onUpdate(bone, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const bone = new THREE.Bone();
      boneRef.current = bone;
      setIsActive(active);

      if (name) bone.name = name;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      bone.position.copy(pos);
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      bone.rotation.copy(rot);
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      bone.scale.copy(sc);

      handleChange(bone);

      return () => {
        boneRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const bone = boneRef.current;
      if (!bone) return;
      if (name) bone.name = name;
      handleChange(bone);
    }, [name, handleChange]);

    useEffect(() => {
      const bone = boneRef.current;
      if (!bone) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      bone.position.copy(pos);
      handleChange(bone);
    }, [position, handleChange]);

    useEffect(() => {
      const bone = boneRef.current;
      if (!bone) return;
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      bone.rotation.copy(rot);
      handleChange(bone);
    }, [rotation, handleChange]);

    useEffect(() => {
      const bone = boneRef.current;
      if (!bone) return;
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      bone.scale.copy(sc);
      handleChange(bone);
    }, [scale, handleChange]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const bone = boneRef.current;
        if (bone) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(bone, delta);
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
        bone: boneRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const bone = boneRef.current;
          if (bone) {
            handleChange(bone);
          }
        },
      }),
      [isActive, handleChange],
    );

    return null;
  },
);

Bone.displayName = "Bone";

export default Bone;
