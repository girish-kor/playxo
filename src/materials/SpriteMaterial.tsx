// play-kit/src/materials/SpriteMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface SpriteMaterialProps {
  color?: string | number | THREE.Color;
  map?: THREE.Texture;
  opacity?: number;
  transparent?: boolean;
  rotation?: number;
  side?: THREE.Side;
  onChange?: (material: THREE.SpriteMaterial) => void;
  onUpdate?: (material: THREE.SpriteMaterial, delta: number) => void;
  active?: boolean;
}

export interface SpriteMaterialRef {
  material: THREE.SpriteMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const SpriteMaterial = forwardRef<SpriteMaterialRef, SpriteMaterialProps>(
  (
    {
      color = 0xffffff,
      map,
      opacity = 1,
      transparent = false,
      rotation = 0,
      side = THREE.FrontSide,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const materialRef = useRef<THREE.SpriteMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.SpriteMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.SpriteMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const mat = new THREE.SpriteMaterial({
        color,
        map,
        opacity,
        transparent,
        rotation,
        side,
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
      mat.opacity = opacity;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [opacity, handleChange]);

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
      mat.rotation = rotation;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [rotation, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.side = side;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [side, handleChange]);

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

SpriteMaterial.displayName = "SpriteMaterial";

export default SpriteMaterial;
