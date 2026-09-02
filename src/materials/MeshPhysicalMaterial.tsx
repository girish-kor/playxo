// play-kit/src/materials/MeshPhysicalMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface MeshPhysicalMaterialProps {
  color?: string | number | THREE.Color;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  sheenRoughness?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  envMap?: THREE.Texture;
  emissive?: string | number | THREE.Color;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  wireframe?: boolean;
  onChange?: (material: THREE.MeshPhysicalMaterial) => void;
  onUpdate?: (material: THREE.MeshPhysicalMaterial, delta: number) => void;
  active?: boolean;
}

export interface MeshPhysicalMaterialRef {
  material: THREE.MeshPhysicalMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const MeshPhysicalMaterial = forwardRef<
  MeshPhysicalMaterialRef,
  MeshPhysicalMaterialProps
>(
  (
    {
      color = 0xffffff,
      roughness = 0.5,
      metalness = 0.5,
      clearcoat = 0,
      clearcoatRoughness = 0,
      sheen = 0,
      sheenRoughness = 0,
      transmission = 0,
      thickness = 0,
      ior = 1.5,
      map,
      normalMap,
      roughnessMap,
      metalnessMap,
      envMap,
      emissive = 0x000000,
      emissiveIntensity = 1,
      transparent = false,
      opacity = 1,
      side = THREE.FrontSide,
      wireframe = false,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.MeshPhysicalMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.MeshPhysicalMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        roughness,
        metalness,
        clearcoat,
        clearcoatRoughness,
        sheen,
        sheenRoughness,
        transmission,
        thickness,
        ior,
        map,
        normalMap,
        roughnessMap,
        metalnessMap,
        envMap,
        emissive: new THREE.Color(emissive),
        emissiveIntensity,
        transparent,
        opacity,
        side,
        wireframe,
      });
      materialRef.current = mat;
      setIsActive(active);
      handleChange(mat);

      return () => {
        mat.dispose();
        materialRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync all props (similar to StandardMaterial; we'll include all)
    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.color = new THREE.Color(color);
      mat.needsUpdate = true;
      handleChange(mat);
    }, [color, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.roughness = roughness;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [roughness, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.metalness = metalness;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [metalness, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.clearcoat = clearcoat;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [clearcoat, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.clearcoatRoughness = clearcoatRoughness;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [clearcoatRoughness, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.sheen = sheen;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [sheen, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.sheenRoughness = sheenRoughness;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [sheenRoughness, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.transmission = transmission;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [transmission, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.thickness = thickness;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [thickness, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.ior = ior;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [ior, handleChange]);

    // Texture maps and other common props
    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.map = map || null;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [map, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.normalMap = normalMap || null;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [normalMap, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.roughnessMap = roughnessMap || null;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [roughnessMap, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.metalnessMap = metalnessMap || null;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [metalnessMap, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.envMap = envMap || null;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [envMap, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.emissive = new THREE.Color(emissive);
      mat.needsUpdate = true;
      handleChange(mat);
    }, [emissive, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.emissiveIntensity = emissiveIntensity;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [emissiveIntensity, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.transparent = transparent;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [transparent, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.opacity = opacity;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [opacity, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.side = side;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [side, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [wireframe, handleChange]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const mat = materialRef.current;
        if (mat) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(mat, delta);
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
        material: materialRef.current,
        active: isActive,
        setActive: (active: boolean) => setIsActive(active),
        update: () => {
          const mat = materialRef.current;
          if (mat) {
            mat.needsUpdate = true;
            handleChange(mat);
          }
        },
      }),
      [isActive, handleChange],
    );

    return null;
  },
);

MeshPhysicalMaterial.displayName = "MeshPhysicalMaterial";

export default MeshPhysicalMaterial;
