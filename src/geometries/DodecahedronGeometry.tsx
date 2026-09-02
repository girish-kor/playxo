// play-kit/src/geometries/DodecahedronGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface DodecahedronGeometryProps {
  radius?: number;
  detail?: number;
  onChange?: (geometry: THREE.DodecahedronGeometry) => void;
}

export interface DodecahedronGeometryRef {
  geometry: THREE.DodecahedronGeometry | null;
  update: () => void;
}

const DodecahedronGeometry = forwardRef<
  DodecahedronGeometryRef,
  DodecahedronGeometryProps
>(({ radius = 1, detail = 0, onChange }, ref) => {
  const geometryRef = useRef<THREE.DodecahedronGeometry | null>(null);

  const handleChange = useCallback(
    (geometry: THREE.DodecahedronGeometry) => {
      if (onChange) onChange(geometry);
    },
    [onChange],
  );

  useEffect(() => {
    const geometry = new THREE.DodecahedronGeometry(radius, detail);
    geometryRef.current = geometry;
    handleChange(geometry);
  }, [radius, detail, handleChange]);

  useImperativeHandle(
    ref,
    () => ({
      geometry: geometryRef.current,
      update: () => {
        const geometry = new THREE.DodecahedronGeometry(radius, detail);
        geometryRef.current = geometry;
        handleChange(geometry);
      },
    }),
    [radius, detail, handleChange],
  );

  return null;
});

DodecahedronGeometry.displayName = "DodecahedronGeometry";

export default DodecahedronGeometry;
