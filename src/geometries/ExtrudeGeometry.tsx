// play-kit/src/geometries/ExtrudeGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface ExtrudeGeometryProps {
  shape: THREE.Shape;
  options?: THREE.ExtrudeGeometryOptions;
  onChange?: (geometry: THREE.ExtrudeGeometry) => void;
}

export interface ExtrudeGeometryRef {
  geometry: THREE.ExtrudeGeometry | null;
  update: () => void;
}

const ExtrudeGeometry = forwardRef<ExtrudeGeometryRef, ExtrudeGeometryProps>(
  ({ shape, options = {}, onChange }, ref) => {
    const geometryRef = useRef<THREE.ExtrudeGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: THREE.ExtrudeGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      const geometry = new THREE.ExtrudeGeometry(shape, options);
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [shape, options, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          const geometry = new THREE.ExtrudeGeometry(shape, options);
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [shape, options, handleChange],
    );

    return null;
  },
);

ExtrudeGeometry.displayName = "ExtrudeGeometry";

export default ExtrudeGeometry;
