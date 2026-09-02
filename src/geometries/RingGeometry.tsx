// playxo/src/geometries/RingGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface RingGeometryProps {
  innerRadius?: number;
  outerRadius?: number;
  thetaSegments?: number;
  phiSegments?: number;
  thetaStart?: number;
  thetaLength?: number;
  onChange?: (geometry: THREE.RingGeometry) => void;
}

export interface RingGeometryRef {
  geometry: THREE.RingGeometry | null;
  update: () => void;
}

const RingGeometry = forwardRef<RingGeometryRef, RingGeometryProps>(
  (
    {
      innerRadius = 0.5,
      outerRadius = 1,
      thetaSegments = 8,
      phiSegments = 1,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.RingGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.RingGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.RingGeometry(
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [
      innerRadius,
      outerRadius,
      thetaSegments,
      phiSegments,
      thetaStart,
      thetaLength,
      handleChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.RingGeometry(
            innerRadius,
            outerRadius,
            thetaSegments,
            phiSegments,
            thetaStart,
            thetaLength,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [
        innerRadius,
        outerRadius,
        thetaSegments,
        phiSegments,
        thetaStart,
        thetaLength,
        handleChange,
      ],
    );

    return null;
  },
);

RingGeometry.displayName = "RingGeometry";

export default RingGeometry;
