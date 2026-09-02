// play-kit/src/materials/MeshLambertMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface MeshLambertMaterialProps {
  color?: string | number | THREE.Color;
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  emissive?: string | number | THREE.Color;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  wireframe?: boolean;
  onChange?: (material: THREE.MeshLambertMaterial) => void;
  onUpdate?: (material: THREE.MeshLambertMaterial, delta: number) => void;
  active?: boolean;
}

export interface MeshLambertMaterialRef {
  material: THREE.MeshLambertMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const MeshLambertMaterial = forwardRef<
  MeshLambertMaterialRef,
  MeshLambertMaterialProps
>(
  (
    {
      color = 0xffffff,
      map,
      normalMap,
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
    const materialRef = useRef<THREE.MeshLambertMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.MeshLambertMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.MeshLambertMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const mat = new THREE.MeshLambertMaterial({
        color,
        map,
        normalMap,
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

MeshLambertMaterial.displayName = "MeshLambertMaterial";

export default MeshLambertMaterial;
