// playxo/src/geometries/BoxGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface BoxGeometryProps {
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  onChange?: (geometry: THREE.BoxGeometry) => void;
}

export interface BoxGeometryRef {
  geometry: THREE.BoxGeometry | null;
  update: () => void;
}

const BoxGeometry = forwardRef<BoxGeometryRef, BoxGeometryProps>(
  (
    {
      width = 1,
      height = 1,
      depth = 1,
      widthSegments = 1,
      heightSegments = 1,
      depthSegments = 1,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<THREE.BoxGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.BoxGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    // Create or update geometry when props change
    useEffect(() => {
      const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth,
        widthSegments,
        heightSegments,
        depthSegments,
      );
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
      handleChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = geometryRef.current;
          if (geometry) {
            // Recreate to apply new params; this is handled by the useEffect anyway.
            // For manual update, we can force recreation by calling the effect,
            // but we'll just re-run the creation logic.
            const newGeo = new THREE.BoxGeometry(
              width,
              height,
              depth,
              widthSegments,
              heightSegments,
              depthSegments,
            );
            geometryRef.current = newGeo;
            handleChange(newGeo);
          }
        },
      }),
      [
        width,
        height,
        depth,
        widthSegments,
        heightSegments,
        depthSegments,
        handleChange,
      ],
    );

    return null;
  },
);

BoxGeometry.displayName = "BoxGeometry";

export default BoxGeometry;
