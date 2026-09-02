// play-kit/src/materials/ShaderMaterial.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface ShaderMaterialProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms?: { [uniform: string]: THREE.IUniform };
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  wireframe?: boolean;
  onChange?: (material: THREE.ShaderMaterial) => void;
  onUpdate?: (material: THREE.ShaderMaterial, delta: number) => void;
  onCompile?: (material: THREE.ShaderMaterial) => void;
  active?: boolean;
}

export interface ShaderMaterialRef {
  material: THREE.ShaderMaterial | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: () => void;
}

const ShaderMaterial = forwardRef<ShaderMaterialRef, ShaderMaterialProps>(
  (
    {
      vertexShader,
      fragmentShader,
      uniforms,
      transparent = false,
      opacity = 1,
      side = THREE.FrontSide,
      wireframe = false,
      onChange,
      onUpdate,
      onCompile,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [isCompiling, setIsCompiling] = useState<boolean>(false);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (mat: THREE.ShaderMaterial) => {
        if (onChange) onChange(mat);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (mat: THREE.ShaderMaterial, delta: number) => {
        if (onUpdate) onUpdate(mat, delta);
      },
      [onUpdate],
    );

    const handleCompile = useCallback(
      (mat: THREE.ShaderMaterial) => {
        if (onCompile) onCompile(mat);
      },
      [onCompile],
    );

    useEffect(() => {
      setIsCompiling(true);
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent,
        opacity,
        side,
        wireframe,
      });
      materialRef.current = mat;
      setIsActive(active);
      // Simulate compile
      setTimeout(() => {
        setIsCompiling(false);
        handleCompile(mat);
      }, 0);
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
      mat.vertexShader = vertexShader;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [vertexShader, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.fragmentShader = fragmentShader;
      mat.needsUpdate = true;
      handleChange(mat);
    }, [fragmentShader, handleChange]);

    useEffect(() => {
      const mat = materialRef.current;
      if (!mat) return;
      mat.uniforms = uniforms || {};
      mat.needsUpdate = true;
      handleChange(mat);
    }, [uniforms, handleChange]);

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

ShaderMaterial.displayName = "ShaderMaterial";

export default ShaderMaterial;
