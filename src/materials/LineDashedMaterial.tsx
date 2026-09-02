// play-kit/src/materials/LineDashedMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface LineDashedMaterialProps {
  color?: string | number | THREE.Color;
  dashSize?: number;
  gapSize?: number;
  scale?: number;
  opacity?: number;
  transparent?: boolean;
  onChange?: (material: THREE.LineDashedMaterial) => void;
  onUpdate?: (material: THREE.LineDashedMaterial, delta: number) => void;
  active?: boolean;
}

export interface LineDashedMaterialRef {
  material: THREE.LineDashedMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const LineDashedMaterial = forwardRef<
  LineDashedMaterialRef,
  LineDashedMaterialProps
>(
  (
    {
      color = 0xffffff,
      dashSize = 1,
      gapSize = 1,
      scale = 1,
      opacity = 1,
      transparent = false,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const materialRef = useRef<THREE.LineDashedMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.LineDashedMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.LineDashedMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const mat = new THREE.LineDashedMaterial({
        color,
        dashSize,
        gapSize,
        scale,
        opacity,
        transparent,
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
      mat.dashSize = dashSize;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [dashSize, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.gapSize = gapSize;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [gapSize, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.scale = scale;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [scale, handleChange]);

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

LineDashedMaterial.displayName = "LineDashedMaterial";

export default LineDashedMaterial;
