// play-kit/src/core/Mesh.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface MeshProps {
  /** Geometry (BufferGeometry or Geometry) */
  geometry?: THREE.BufferGeometry;
  /** Material (Material or array of materials) */
  material?: THREE.Material | THREE.Material[];
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Rotation as Euler or [x, y, z] (order XYZ) */
  rotation?: [number, number, number] | THREE.Euler;
  /** Scale as [x, y, z] or Vector3 */
  scale?: [number, number, number] | THREE.Vector3;
  /** Whether the mesh casts shadows */
  castShadow?: boolean;
  /** Whether the mesh receives shadows */
  receiveShadow?: boolean;
  /** Whether the mesh is visible */
  visible?: boolean;

  /** Called when mesh properties change */
  onChange?: (mesh: THREE.Mesh) => void;
  /** Called each frame while active */
  onUpdate?: (mesh: THREE.Mesh, delta: number) => void;
  /** Called when mesh is clicked (requires raycasting setup) */
  onClick?: (event: MouseEvent, mesh: THREE.Mesh) => void;
  /** Called when mesh is hovered (requires raycasting setup) */
  onHover?: (event: MouseEvent, mesh: THREE.Mesh, hovered: boolean) => void;

  /** Accessibility label */
  "aria-label"?: string;

  /** Whether the mesh is active (enables onUpdate loop) */
  active?: boolean;
}

export interface MeshRef {
  /** The underlying Three.js Mesh */
  mesh: THREE.Mesh | null;
  /** Whether the mesh is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
  /** Perform raycast on this mesh (returns intersections) */
  raycast: (raycaster: THREE.Raycaster) => THREE.Intersection[];
}

const Mesh = forwardRef<MeshRef, MeshProps>(
  (
    {
      geometry,
      material,
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      castShadow = false,
      receiveShadow = false,
      visible = true,
      onChange,
      onUpdate,
      onClick,
      onHover,
      "aria-label": ariaLabel,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const meshRef = useRef<THREE.Mesh | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mesh: THREE.Mesh) => {
        if (onChange) onChange(mesh);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mesh: THREE.Mesh, delta: number) => {
        if (onUpdate) onUpdate(mesh, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      // Mesh requires geometry and material; if missing, we create default placeholder
      const mesh = new THREE.Mesh(
        geometry || new THREE.BoxGeometry(1, 1, 1),
        material || new THREE.MeshStandardMaterial(),
      );
      meshRef.current = mesh;
      setIsActive(active);

      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      mesh.position.copy(pos);
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      mesh.rotation.copy(rot);
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      mesh.scale.copy(sc);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      mesh.visible = visible;

      if (ariaLabel) mesh.userData["aria-label"] = ariaLabel;

      handleChange(mesh);

      return () => {
        meshRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update geometry/material (recreate if changed)
    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      if (geometry) mesh.geometry = geometry;
      if (material) mesh.material = material;
      handleChange(mesh);
    }, [geometry, material, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      mesh.position.copy(pos);
      handleChange(mesh);
    }, [position, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      mesh.rotation.copy(rot);
      handleChange(mesh);
    }, [rotation, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const sc = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      mesh.scale.copy(sc);
      handleChange(mesh);
    }, [scale, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.castShadow = castShadow;
      handleChange(mesh);
    }, [castShadow, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.receiveShadow = receiveShadow;
      handleChange(mesh);
    }, [receiveShadow, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.visible = visible;
      handleChange(mesh);
    }, [visible, handleChange]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.userData["aria-label"] = ariaLabel || "";
    }, [ariaLabel]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const mesh = meshRef.current;
        if (mesh) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(mesh, delta);
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

    // Raycast method
    const raycast = useCallback(
      (raycaster: THREE.Raycaster): THREE.Intersection[] => {
        const mesh = meshRef.current;
        if (!mesh) return [];
        const intersects = raycaster.intersectObject(mesh);
        // If onClick/onHover are provided, we could call them here but that would require event handling.
        return intersects;
      },
      [],
    );

    useImperativeHandle(
      ref,
      () => ({
        mesh: meshRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const mesh = meshRef.current;
          if (mesh) {
            handleChange(mesh);
          }
        },
        raycast,
      }),
      [isActive, handleChange, raycast],
    );

    return null;
  },
);

Mesh.displayName = "Mesh";

export default Mesh;
