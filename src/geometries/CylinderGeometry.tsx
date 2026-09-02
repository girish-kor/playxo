// play-kit/src/geometries/CylinderGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface CylinderGeometryProps {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
  onChange?: (geometry: THREE.CylinderGeometry) => void;
}

export interface CylinderGeometryRef {
  geometry: THREE.CylinderGeometry | null;
  update: () => void;
}

const CylinderGeometry = forwardRef<CylinderGeometryRef, CylinderGeometryProps>(
  (
    {
      radiusTop = 1,
      radiusBottom = 1,
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
    const geometryRef = useRef<THREE.CylinderGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.CylinderGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
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
      radiusTop,
      radiusBottom,
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
          const geometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
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
        radiusTop,
        radiusBottom,
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

CylinderGeometry.displayName = "CylinderGeometry";

export default CylinderGeometry;
