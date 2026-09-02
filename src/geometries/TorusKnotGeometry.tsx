// playxo/src/geometries/TorusKnotGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface TorusKnotGeometryProps {
  radius?: number;
  tube?: number;
  tubularSegments?: number;
  radialSegments?: number;
  p?: number;
  q?: number;
  onChange?: (geometry: THREE.TorusKnotGeometry) => void;
}

export interface TorusKnotGeometryRef {
  geometry: THREE.TorusKnotGeometry | null;
  update: () => void;
}

const TorusKnotGeometry = forwardRef<
  TorusKnotGeometryRef,
  TorusKnotGeometryProps
>(
  (
    {
      radius = 1,
      tube = 0.4,
      tubularSegments = 64,
      radialSegments = 8,
      p = 2,
      q = 3,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.TorusKnotGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.TorusKnotGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.TorusKnotGeometry(
        radius,
        tube,
        tubularSegments,
        radialSegments,
        p,
        q,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [radius, tube, tubularSegments, radialSegments, p, q, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.TorusKnotGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [radius, tube, tubularSegments, radialSegments, p, q, handleChange],
    );

    return null;
  },
);

TorusKnotGeometry.displayName = "TorusKnotGeometry";

export default TorusKnotGeometry;
