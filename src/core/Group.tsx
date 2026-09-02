// playxo/src/core/Group.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface GroupProps {
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Rotation as Euler or [x, y, z] (order XYZ) */
  rotation?: [number, number, number] | THREE.Euler;
  /** Scale as [x, y, z] or Vector3 */
  scale?: [number, number, number] | THREE.Vector3;
  /** Whether the group is visible */
  visible?: boolean;
  /** Child elements (3D objects) */
  children?: React.ReactNode;

  /** Called when group properties change */
  onChange?: (group: THREE.Group) => void;
  /** Called each frame while active */
  onUpdate?: (group: THREE.Group, delta: number) => void;

  /** Whether the group is active (enables onUpdate loop) */
  active?: boolean;
}

export interface GroupRef {
  /** The underlying Three.js Group */
  group: THREE.Group | null;
  /** Whether the group is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const Group = forwardRef<GroupRef, GroupProps>(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      visible = true,
      children,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const groupRef = useRef<THREE.Group | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (group: THREE.Group) => {
        if (onChange) onChange(group);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (group: THREE.Group, delta: number) => {
        if (onUpdate) onUpdate(group, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const group = new THREE.Group();
      groupRef.current = group;
      setIsActive(active);

      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      group.position.copy(pos);
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      group.rotation.copy(rot);
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      group.scale.copy(sc);
      group.visible = visible;

      handleChange(group);

      return () => {
        groupRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const group = groupRef.current;
      if (!group) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      group.position.copy(pos);
      handleChange(group);
    }, [position, handleChange]);

    useEffect(() => {
      const group = groupRef.current;
      if (!group) return;
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      group.rotation.copy(rot);
      handleChange(group);
    }, [rotation, handleChange]);

    useEffect(() => {
      const group = groupRef.current;
      if (!group) return;
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      group.scale.copy(sc);
      handleChange(group);
    }, [scale, handleChange]);

    useEffect(() => {
      const group = groupRef.current;
      if (!group) return;
      group.visible = visible;
      handleChange(group);
    }, [visible, handleChange]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const group = groupRef.current;
        if (group) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(group, delta);
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
        group: groupRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const group = groupRef.current;
          if (group) {
            handleChange(group);
          }
        },
      }),
      [isActive, handleChange],
    );

    return null;
  },
);

Group.displayName = "Group";

export default Group;
