// play-kit/src/geometries/SphereGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface SphereGeometryProps {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
  onChange?: (geometry: THREE.SphereGeometry) => void;
}

export interface SphereGeometryRef {
  geometry: THREE.SphereGeometry | null;
  update: () => void;
}

const SphereGeometry = forwardRef<SphereGeometryRef, SphereGeometryProps>(
  (
    {
      radius = 1,
      widthSegments = 32,
      heightSegments = 16,
      phiStart = 0,
      phiLength = Math.PI * 2,
      thetaStart = 0,
      thetaLength = Math.PI,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.SphereGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.SphereGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments,
        phiStart,
        phiLength,
        thetaStart,
        thetaLength,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength,
      handleChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.SphereGeometry(
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [
        radius,
        widthSegments,
        heightSegments,
        phiStart,
        phiLength,
        thetaStart,
        thetaLength,
        handleChange,
      ],
    );

    return null;
  },
);

SphereGeometry.displayName = "SphereGeometry";

export default SphereGeometry;
