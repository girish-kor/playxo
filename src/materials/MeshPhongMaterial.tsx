// play-kit/src/materials/MeshPhongMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface MeshPhongMaterialProps {
  color?: string | number | THREE.Color;
  specular?: string | number | THREE.Color;
  shininess?: number;
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  emissive?: string | number | THREE.Color;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  wireframe?: boolean;
  onChange?: (material: THREE.MeshPhongMaterial) => void;
  onUpdate?: (material: THREE.MeshPhongMaterial, delta: number) => void;
  active?: boolean;
}

export interface MeshPhongMaterialRef {
  material: THREE.MeshPhongMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const MeshPhongMaterial = forwardRef<
  MeshPhongMaterialRef,
  MeshPhongMaterialProps
>(
  (
    {
      color = 0xffffff,
      specular = 0x111111,
      shininess = 30,
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
    const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.MeshPhongMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.MeshPhongMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const mat = new THREE.MeshPhongMaterial({
        color,
        specular: new THREE.Color(specular),
        shininess,
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
      mat.specular = new THREE.Color(specular);
      mat.needsUpdate = true;
      handleChange(mat);
    }, [specular, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.shininess = shininess;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [shininess, handleChange]);

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

MeshPhongMaterial.displayName = "MeshPhongMaterial";

export default MeshPhongMaterial;
