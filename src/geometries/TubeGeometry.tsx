// play-kit/src/geometries/TubeGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface TubeGeometryProps {
  path: THREE.Curve<THREE.Vector3>;
  tubularSegments?: number;
  radius?: number;
  radialSegments?: number;
  closed?: boolean;
  onChange?: (geometry: THREE.TubeGeometry) => void;
}

export interface TubeGeometryRef {
  geometry: THREE.TubeGeometry | null;
  update: () => void;
}

const TubeGeometry = forwardRef<TubeGeometryRef, TubeGeometryProps>(
  (
    {
      path,
      tubularSegments = 64,
      radius = 1,
      radialSegments = 8,
      closed = false,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.TubeGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.TubeGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.TubeGeometry(
        path,
        tubularSegments,
        radius,
        radialSegments,
        closed,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [path, tubularSegments, radius, radialSegments, closed, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.TubeGeometry(
            path,
            tubularSegments,
            radius,
            radialSegments,
            closed,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [path, tubularSegments, radius, radialSegments, closed, handleChange],
    );

    return null;
  },
);

TubeGeometry.displayName = "TubeGeometry";

export default TubeGeometry;
