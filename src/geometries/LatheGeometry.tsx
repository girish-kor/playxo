// playxo/src/geometries/LatheGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface LatheGeometryProps {
  points: THREE.Vector2[];
  segments?: number;
  phiStart?: number;
  phiLength?: number;
  onChange?: (geometry: THREE.LatheGeometry) => void;
}

export interface LatheGeometryRef {
  geometry: THREE.LatheGeometry | null;
  update: () => void;
}

const LatheGeometry = forwardRef<LatheGeometryRef, LatheGeometryProps>(
  (
    { points, segments = 12, phiStart = 0, phiLength = Math.PI * 2, onChange },
    ref,
  ) => {
    const geometryRef = useRef<THREE.LatheGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.LatheGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.LatheGeometry(
        points,
        segments,
        phiStart,
        phiLength,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [points, segments, phiStart, phiLength, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.LatheGeometry(
            points,
            segments,
            phiStart,
            phiLength,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [points, segments, phiStart, phiLength, handleChange],
    );

    return null;
  },
);

LatheGeometry.displayName = "LatheGeometry";

export default LatheGeometry;
