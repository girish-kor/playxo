// playxo/src/geometries/TetrahedronGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface TetrahedronGeometryProps {
  radius?: number;
  detail?: number;
  onChange?: (geometry: THREE.TetrahedronGeometry) => void;
}

export interface TetrahedronGeometryRef {
  geometry: THREE.TetrahedronGeometry | null;
  update: () => void;
}

const TetrahedronGeometry = forwardRef<
  TetrahedronGeometryRef,
  TetrahedronGeometryProps
>(({ radius = 1, detail = 0, onChange }, ref) => {
  const geometryRef = useRef<THREE.TetrahedronGeometry | null>(null);

  const handleChange = useCallback(
    (geometry: THREE.TetrahedronGeometry) => {
      if (onChange) onChange(geometry);
    },
    [onChange],
  );

  useEffect(() => {
    const geometry = new THREE.TetrahedronGeometry(radius, detail);
    geometryRef.current = geometry;
    handleChange(geometry);
  }, [radius, detail, handleChange]);

  useImperativeHandle(
    ref,
    () => ({
      geometry: geometryRef.current,
      update: () => {
        const geometry = new THREE.TetrahedronGeometry(radius, detail);
        geometryRef.current = geometry;
        handleChange(geometry);
      },
    }),
    [radius, detail, handleChange],
  );

  return null;
});

TetrahedronGeometry.displayName = "TetrahedronGeometry";

export default TetrahedronGeometry;
