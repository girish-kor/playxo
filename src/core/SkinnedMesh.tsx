// play-kit/src/core/SkinnedMesh.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface SkinnedMeshProps {
  /** Geometry (BufferGeometry) */
  geometry?: THREE.BufferGeometry;
  /** Material (Material) */
  material?: THREE.Material;
  /** Skeleton for skinning */
  skeleton?: THREE.Skeleton;
  /** Bind mode (e.g., 'attached', 'detached') */
  bindMode?: string;
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
  onChange?: (mesh: THREE.SkinnedMesh) => void;
  /** Called each frame while active */
  onUpdate?: (mesh: THREE.SkinnedMesh, delta: number) => void;
  /** Called on animation frame (per frame) */
  onAnimationFrame?: (mesh: THREE.SkinnedMesh) => void;

  /** Whether the mesh is active (enables onUpdate loop) */
  active?: boolean;
}

export interface SkinnedMeshRef {
  /** The underlying Three.js SkinnedMesh */
  mesh: THREE.SkinnedMesh | null;
  /** Whether the mesh is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const SkinnedMesh = forwardRef<SkinnedMeshRef, SkinnedMeshProps>(
  (
    {
      geometry,
      material,
      skeleton,
      bindMode = "attached",
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      castShadow = false,
      receiveShadow = false,
      visible = true,
      onChange,
      onUpdate,
      onAnimationFrame,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const meshRef = useRef<THREE.SkinnedMesh | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mesh: THREE.SkinnedMesh) => {
        if (onChange) onChange(mesh);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mesh: THREE.SkinnedMesh, delta: number) => {
        if (onUpdate) onUpdate(mesh, delta);
      },
      [onUpdate],
    );

    const handleAnimationFrame = useCallback(
      (mesh: THREE.SkinnedMesh) => {
        if (onAnimationFrame) onAnimationFrame(mesh);
      },
      [onAnimationFrame],
    );

    useEffect(() => {
      const defaultGeo = geometry || new THREE.BoxGeometry(1, 1, 1);
      const defaultMat = material || new THREE.MeshStandardMaterial();
      const mesh = new THREE.SkinnedMesh(defaultGeo, defaultMat);
      meshRef.current = mesh;
      setIsActive(active);
      setIsAnimating(false);

      if (skeleton) {
        mesh.bind(skeleton);
        if (bindMode === "detached") {
          // Some logic for detached mode? Three.js uses `bind` with optional matrix.
        }
      }

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
      if (skeleton) {
        mesh.bind(skeleton);
      }
      handleChange(mesh);
    }, [skeleton, handleChange]);

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
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!isActive) {
        setIsAnimating(false);
        return;
      }
      // If we have onUpdate or onAnimationFrame, run loop
      if (!onUpdate && !onAnimationFrame) return;

      const loop = (time: number) => {
        const mesh = meshRef.current;
        if (mesh) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          setIsAnimating(true);
          if (onUpdate) handleUpdate(mesh, delta);
          if (onAnimationFrame) handleAnimationFrame(mesh);
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
        setIsAnimating(false);
      };
    }, [
      isActive,
      onUpdate,
      onAnimationFrame,
      handleUpdate,
      handleAnimationFrame,
    ]);

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
      }),
      [isActive, handleChange],
    );

    return null;
  },
);

SkinnedMesh.displayName = "SkinnedMesh";

export default SkinnedMesh;
