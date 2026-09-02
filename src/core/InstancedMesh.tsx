// playxo/src/core/InstancedMesh.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface InstancedMeshProps {
  /** Geometry (BufferGeometry) */
  geometry?: THREE.BufferGeometry;
  /** Material (Material) */
  material?: THREE.Material;
  /** Number of instances */
  count?: number;
  /** Instance matrix (Float32Array or Matrix4 array) */
  instanceMatrix?: Float32Array | THREE.Matrix4[];
  /** Instance colors (Float32Array or Color array) */
  instanceColor?: Float32Array | THREE.Color[];
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
  onChange?: (mesh: THREE.InstancedMesh) => void;
  /** Called each frame while active */
  onUpdate?: (mesh: THREE.InstancedMesh, delta: number) => void;

  /** Whether the mesh is active (enables onUpdate loop) */
  active?: boolean;
}

export interface InstancedMeshRef {
  /** The underlying Three.js InstancedMesh */
  mesh: THREE.InstancedMesh | null;
  /** Whether the mesh is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
  /** Update instance matrix at index */
  setMatrixAt: (index: number, matrix: THREE.Matrix4) => void;
  /** Update instance color at index */
  setColorAt: (index: number, color: THREE.Color) => void;
}

const InstancedMesh = forwardRef<InstancedMeshRef, InstancedMeshProps>(
  (
    {
      geometry,
      material,
      count = 1,
      instanceMatrix,
      instanceColor,
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      castShadow = false,
      receiveShadow = false,
      visible = true,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const meshRef = useRef<THREE.InstancedMesh | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mesh: THREE.InstancedMesh) => {
        if (onChange) onChange(mesh);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mesh: THREE.InstancedMesh, delta: number) => {
        if (onUpdate) onUpdate(mesh, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const defaultGeo = geometry || new THREE.BoxGeometry(1, 1, 1);
      const defaultMat = material || new THREE.MeshStandardMaterial();
      const mesh = new THREE.InstancedMesh(defaultGeo, defaultMat, count);
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

      // Set instance matrix if provided
      if (instanceMatrix) {
        if (Array.isArray(instanceMatrix)) {
          // assume Matrix4 array
          instanceMatrix.forEach((m, i) => {
            if (i < count) mesh.setMatrixAt(i, m);
          });
        } else {
          // Float32Array
          mesh.instanceMatrix = new THREE.InstancedBufferAttribute(
            instanceMatrix,
            4,
          );
        }
        mesh.instanceMatrix.needsUpdate = true;
      }

      if (instanceColor) {
        if (Array.isArray(instanceColor)) {
          instanceColor.forEach((c, i) => {
            if (i < count) mesh.setColorAt(i, c);
          });
        } else {
          mesh.instanceColor = new THREE.InstancedBufferAttribute(
            instanceColor,
            3,
          );
          // Mark needsUpdate after assignment
          mesh.instanceColor.needsUpdate = true;
        }
        // Only if we assigned instanceColor, mark needsUpdate
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }

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
      if (geometry) {
        // InstancedMesh cannot change geometry easily; we'd need to recreate.
        // For simplicity, we'll just warn or ignore.
        console.warn(
          "Changing geometry on InstancedMesh is not supported; recreate component.",
        );
      }
      if (material) {
        mesh.material = material;
      }
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

    const setMatrixAt = useCallback(
      (index: number, matrix: THREE.Matrix4) => {
        const mesh = meshRef.current;
        if (mesh) {
          mesh.setMatrixAt(index, matrix);
          mesh.instanceMatrix.needsUpdate = true;
          handleChange(mesh);
        }
      },
      [handleChange],
    );

    const setColorAt = useCallback(
      (index: number, color: THREE.Color) => {
        const mesh = meshRef.current;
        if (mesh) {
          mesh.setColorAt(index, color);
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
          handleChange(mesh);
        }
      },
      [handleChange],
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
        setMatrixAt,
        setColorAt,
      }),
      [isActive, handleChange, setMatrixAt, setColorAt],
    );

    return null;
  },
);

InstancedMesh.displayName = "InstancedMesh";

export default InstancedMesh;
