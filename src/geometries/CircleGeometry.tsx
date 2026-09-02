// play-kit/src/geometries/CircleGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface CircleGeometryProps {
  radius?: number;
  segments?: number;
  thetaStart?: number;
  thetaLength?: number;
  onChange?: (geometry: THREE.CircleGeometry) => void;
}

export interface CircleGeometryRef {
  geometry: THREE.CircleGeometry | null;
  update: () => void;
}

const CircleGeometry = forwardRef<CircleGeometryRef, CircleGeometryProps>(
  (
    {
      radius = 1,
      segments = 32,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.CircleGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.CircleGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.CircleGeometry(
        radius,
        segments,
        thetaStart,
        thetaLength,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [radius, segments, thetaStart, thetaLength, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.CircleGeometry(
            radius,
            segments,
            thetaStart,
            thetaLength,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [radius, segments, thetaStart, thetaLength, handleChange],
    );

    return null;
  },
);

CircleGeometry.displayName = "CircleGeometry";

export default CircleGeometry;
