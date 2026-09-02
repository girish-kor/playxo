// play-kit/src/materials/MeshDepthMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface MeshDepthMaterialProps {
  depthPacking?: THREE.DepthPackingStrategies;
  map?: THREE.Texture;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  onChange?: (material: THREE.MeshDepthMaterial) => void;
  onUpdate?: (material: THREE.MeshDepthMaterial, delta: number) => void;
  active?: boolean;
}

export interface MeshDepthMaterialRef {
  material: THREE.MeshDepthMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const MeshDepthMaterial = forwardRef<
  MeshDepthMaterialRef,
  MeshDepthMaterialProps
>(
  (
    {
      depthPacking = THREE.BasicDepthPacking,
      map,
      transparent = false,
      opacity = 1,
      side = THREE.FrontSide,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const materialRef = useRef<THREE.MeshDepthMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.MeshDepthMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.MeshDepthMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const mat = new THREE.MeshDepthMaterial({
        depthPacking,
        map,
        transparent,
        opacity,
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
      mat.depthPacking = depthPacking;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [depthPacking, handleChange]);

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

MeshDepthMaterial.displayName = "MeshDepthMaterial";

export default MeshDepthMaterial;
