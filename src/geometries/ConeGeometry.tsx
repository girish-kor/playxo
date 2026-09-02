// play-kit/src/geometries/ConeGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface ConeGeometryProps {
  radius?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
  onChange?: (geometry: THREE.ConeGeometry) => void;
}

export interface ConeGeometryRef {
  geometry: THREE.ConeGeometry | null;
  update: () => void;
}

const ConeGeometry = forwardRef<ConeGeometryRef, ConeGeometryProps>(
  (
    {
      radius = 1,
      height = 1,
      radialSegments = 8,
      heightSegments = 1,
      openEnded = false,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.ConeGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.ConeGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.ConeGeometry(
        radius,
        height,
        radialSegments,
        heightSegments,
        openEnded,
        thetaStart,
        thetaLength,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [
      radius,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
      handleChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.ConeGeometry(
            radius,
            height,
            radialSegments,
            heightSegments,
            openEnded,
            thetaStart,
            thetaLength,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [
        radius,
        height,
        radialSegments,
        heightSegments,
        openEnded,
        thetaStart,
        thetaLength,
        handleChange,
      ],
    );

    return null;
  },
);

ConeGeometry.displayName = "ConeGeometry";

export default ConeGeometry;
