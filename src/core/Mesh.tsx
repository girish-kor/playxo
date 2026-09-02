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
  /** Geometry instance (BufferGeometry or derived) */
  geometry: THREE.BufferGeometry;
  /** Material instance (or array of materials) */
  material: THREE.Material | THREE.Material[];
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Rotation as Euler angles [x, y, z] or Euler instance */
  rotation?: [number, number, number] | THREE.Euler;
  /** Scale as [x, y, z] or Vector3 */
  scale?: [number, number, number] | THREE.Vector3;
  /** Whether the mesh casts shadows */
  castShadow?: boolean;
  /** Whether the mesh receives shadows */
  receiveShadow?: boolean;

  /** Variant of the mesh (default: 'mesh') */
  variant?: "mesh" | "instanced" | "skinned";

  // Events
  onClick?: (event: MouseEvent, mesh: THREE.Mesh) => void;
  onHover?: (hovered: boolean, mesh: THREE.Mesh) => void;
  onUpdate?: (mesh: THREE.Mesh, delta: number) => void;

  // Accessibility
  "aria-label"?: string;

  // Optional camera for built‑in interaction detection (raycasting)
  camera?: THREE.Camera;
}

export interface MeshRef {
  /** The underlying Three.js Mesh (or InstancedMesh/SkinnedMesh) */
  mesh: THREE.Mesh | null;
  /** Current hovered state */
  hovered: boolean;
  /** Current selected state */
  selected: boolean;
  /** Current active state */
  active: boolean;
  /** Manually set hovered state (triggers onHover) */
  setHovered: (hovered: boolean) => void;
  /** Manually set selected state */
  setSelected: (selected: boolean) => void;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force a click event (triggers onClick) */
  click: (event?: MouseEvent) => void;
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
      variant = "mesh",
      onClick,
      onHover,
      onUpdate,
      "aria-label": ariaLabel,
      camera,
    },
    ref,
  ) => {
    // Internal states
    const [hovered, setHoveredState] = useState<boolean>(false);
    const [selected, setSelectedState] = useState<boolean>(false);
    const [active, setActiveState] = useState<boolean>(false);

    // Refs
    const meshRef = useRef<THREE.Mesh | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    // Stabilize callbacks
    const handleClick = useCallback(
      (event: MouseEvent, mesh: THREE.Mesh) => {
        if (onClick) onClick(event, mesh);
      },
      [onClick],
    );

    const handleHover = useCallback(
      (hovered: boolean, mesh: THREE.Mesh) => {
        if (onHover) onHover(hovered, mesh);
      },
      [onHover],
    );

    // Create the mesh instance when variant or geometry/material change
    // (geometry and material are expected to be stable, but we recreate on variant change)
    useEffect(() => {
      let mesh: THREE.Mesh;
      switch (variant) {
        case "instanced":
          // For InstancedMesh we need a count; default to 1 if not provided.
          // Since no count prop is specified, we fallback to a regular Mesh.
          // In a real implementation, you would add `count` and `instanceMatrix` props.
          mesh = new THREE.InstancedMesh(geometry, material, 1);
          break;
        case "skinned":
          mesh = new THREE.SkinnedMesh(geometry, material);
          break;
        default:
          mesh = new THREE.Mesh(geometry, material);
          break;
      }

      // Apply initial transforms
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      mesh.position.copy(pos);

      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      mesh.rotation.copy(rot);

      const scl = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      mesh.scale.copy(scl);

      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;

      meshRef.current = mesh;

      // Reset states on new mesh
      setHoveredState(false);
      setSelectedState(false);
      setActiveState(false);

      // Cleanup old mesh (no disposal needed, but we can dispose geometry/material if owned)
      // Here we assume they are managed externally.

      return () => {
        meshRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, geometry, material]); // recreate only when variant changes; props updated via separate effects

    // Update geometry and material if they change (without recreating the mesh)
    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      // Update geometry and material
      mesh.geometry = geometry;
      mesh.material = material;
      // Note: if material is an array, we might need to handle that, but assignment works.
    }, [geometry, material]);

    // Update transform properties
    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;

      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      mesh.position.copy(pos);
    }, [position]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;

      const rot = Array.isArray(rotation)
        ? new THREE.Euler(...rotation)
        : rotation;
      mesh.rotation.copy(rot);
    }, [rotation]);

    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;

      const scl = Array.isArray(scale) ? new THREE.Vector3(...scale) : scale;
      mesh.scale.copy(scl);
    }, [scale]);

    // Update shadow properties
    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
    }, [castShadow, receiveShadow]);

    // Accessibility: set userData for aria-label
    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.userData["aria-label"] = ariaLabel || "";
    }, [ariaLabel]);

    // Animation loop for onUpdate
    useEffect(() => {
      if (!onUpdate) return;

      const loop = (time: number) => {
        const mesh = meshRef.current;
        if (mesh) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          onUpdate(mesh, delta);
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
    }, [onUpdate]);

    // Interaction detection (raycasting) using the optional camera prop
    useEffect(() => {
      if (!camera) return; // no camera – no automatic interaction

      const canvas = document.querySelector("canvas");
      if (!canvas) return; // no canvas found

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const onPointerDown = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(
          meshRef.current as THREE.Object3D,
          false,
        );

        if (intersects.length > 0) {
          // Click event
          handleClick(event, meshRef.current!);
          // Toggle active state (example: set active on click)
          setActiveState((prev) => !prev);
        }
      };

      const onPointerMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(
          meshRef.current as THREE.Object3D,
          false,
        );

        const isHovered = intersects.length > 0;
        if (isHovered !== hovered) {
          setHoveredState(isHovered);
          handleHover(isHovered, meshRef.current!);
        }
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);

      return () => {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
      };
    }, [camera, handleClick, handleHover, hovered]);

    // Expose imperative methods and state via ref
    useImperativeHandle(
      ref,
      () => ({
        mesh: meshRef.current,
        hovered,
        selected,
        active,
        setHovered: (h: boolean) => {
          setHoveredState(h);
          if (meshRef.current) handleHover(h, meshRef.current);
        },
        setSelected: setSelectedState,
        setActive: setActiveState,
        click: (event?: MouseEvent) => {
          if (meshRef.current)
            handleClick(event || new MouseEvent("click"), meshRef.current);
        },
      }),
      [hovered, selected, active, handleHover, handleClick],
    );

    // This component renders nothing; the mesh is managed via refs.
    return null;
  },
);

Mesh.displayName = "Mesh";

export default Mesh;
