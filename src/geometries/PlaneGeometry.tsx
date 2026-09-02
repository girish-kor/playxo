// playxo/src/geometries/PlaneGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface PlaneGeometryProps {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
  onChange?: (geometry: THREE.PlaneGeometry) => void;
}

export interface PlaneGeometryRef {
  geometry: THREE.PlaneGeometry | null;
  update: () => void;
}

const PlaneGeometry = forwardRef<PlaneGeometryRef, PlaneGeometryProps>(
  (
    { width = 1, height = 1, widthSegments = 1, heightSegments = 1, onChange },
    ref,
  ) => {
    const geometryRef = useRef<THREE.PlaneGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.PlaneGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.PlaneGeometry(
        width,
        height,
        widthSegments,
        heightSegments,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [width, height, widthSegments, heightSegments, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.PlaneGeometry(
            width,
            height,
            widthSegments,
            heightSegments,
          );
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [width, height, widthSegments, heightSegments, handleChange],
    );

    return null;
  },
);

PlaneGeometry.displayName = "PlaneGeometry";

export default PlaneGeometry;
