// playxo/src/geometries/ParametricGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

export interface ParametricGeometryProps {
  func: (u: number, v: number, target: THREE.Vector3) => void;
  slices?: number;
  stacks?: number;
  onChange?: (geometry: ParametricGeometry) => void;
}

export interface ParametricGeometryRef {
  geometry: ParametricGeometry | null;
  update: () => void;
}

const ParametricGeometryComponent = forwardRef<
  ParametricGeometryRef,
  ParametricGeometryProps
>(({ func, slices = 8, stacks = 8, onChange }, ref) => {
  const geometryRef = useRef<ParametricGeometry | null>(null);

  const handleChange = useCallback(
    (geometry: ParametricGeometry) => {
      if (onChange) onChange(geometry);
    },
    [onChange],
  );

  useEffect(() => {
    const geometry = new ParametricGeometry(func, slices, stacks);
    geometryRef.current = geometry;
    handleChange(geometry);
  }, [func, slices, stacks, handleChange]);

  useImperativeHandle(
    ref,
    () => ({
      geometry: geometryRef.current,
      update: () => {
        const geometry = new ParametricGeometry(func, slices, stacks);
        geometryRef.current = geometry;
        handleChange(geometry);
      },
    }),
    [func, slices, stacks, handleChange],
  );

  return null;
});

ParametricGeometryComponent.displayName = "ParametricGeometry";

export default ParametricGeometryComponent;
