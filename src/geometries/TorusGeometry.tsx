// playxo/src/geometries/TorusGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface TorusGeometryProps {
  radius?: number;
  tube?: number;
  radialSegments?: number;
  tubularSegments?: number;
  arc?: number;
  onChange?: (geometry: THREE.TorusGeometry) => void;
}

export interface TorusGeometryRef {
  geometry: THREE.TorusGeometry | null;
  update: () => void;
}

const TorusGeometry = forwardRef<TorusGeometryRef, TorusGeometryProps>(
  (
    {
      radius = 1,
      tube = 0.4,
      radialSegments = 8,
      tubularSegments = 6,
      arc = Math.PI * 2,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.TorusGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.TorusGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.TorusGeometry(
        radius,
        tube,
        radialSegments,
        tubularSegments,
        arc,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [radius, tube, radialSegments, tubularSegments, arc, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.TorusGeometry(
            radius,
            tube,
            radialSegments,
            tubularSegments,
            arc,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [radius, tube, radialSegments, tubularSegments, arc, handleChange],
    );

    return null;
  },
);

TorusGeometry.displayName = "TorusGeometry";

export default TorusGeometry;
