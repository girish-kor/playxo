// play-kit/src/geometries/OctahedronGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface OctahedronGeometryProps {
  radius?: number;
  detail?: number;
  onChange?: (geometry: THREE.OctahedronGeometry) => void;
}

export interface OctahedronGeometryRef {
  geometry: THREE.OctahedronGeometry | null;
  update: () => void;
}

const OctahedronGeometry = forwardRef<
  OctahedronGeometryRef,
  OctahedronGeometryProps
>(({ radius = 1, detail = 0, onChange }, ref) => {
  const geometryRef = useRef<THREE.OctahedronGeometry | null>(null);

  const handleChange = useCallback(
    (geometry: THREE.OctahedronGeometry) => {
      if (onChange) onChange(geometry);
    },
    [onChange],
  );

  useEffect(() => {
    const geometry = new THREE.OctahedronGeometry(radius, detail);
    geometryRef.current = geometry;
    handleChange(geometry);
  }, [radius, detail, handleChange]);

  useImperativeHandle(
    ref,
    () => ({
      geometry: geometryRef.current,
      update: () => {
        const geometry = new THREE.OctahedronGeometry(radius, detail);
        geometryRef.current = geometry;
        handleChange(geometry);
      },
    }),
    [radius, detail, handleChange],
  );

  return null;
});

OctahedronGeometry.displayName = "OctahedronGeometry";

export default OctahedronGeometry;
