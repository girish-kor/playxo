// play-kit/src/geometries/IcosahedronGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface IcosahedronGeometryProps {
  radius?: number;
  detail?: number;
  onChange?: (geometry: THREE.IcosahedronGeometry) => void;
}

export interface IcosahedronGeometryRef {
  geometry: THREE.IcosahedronGeometry | null;
  update: () => void;
}

const IcosahedronGeometry = forwardRef<
  IcosahedronGeometryRef,
  IcosahedronGeometryProps
>(({ radius = 1, detail = 0, onChange }, ref) => {
  const geometryRef = useRef<THREE.IcosahedronGeometry | null>(null);

  const handleChange = useCallback(
    (geometry: THREE.IcosahedronGeometry) => {
      if (onChange) onChange(geometry);
    },
    [onChange],
  );

  useEffect(() => {
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    geometryRef.current = geometry;
    handleChange(geometry);
  }, [radius, detail, handleChange]);

  useImperativeHandle(
    ref,
    () => ({
      geometry: geometryRef.current,
      update: () => {
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        geometryRef.current = geometry;
        handleChange(geometry);
      },
    }),
    [radius, detail, handleChange],
  );

  return null;
});

IcosahedronGeometry.displayName = "IcosahedronGeometry";

export default IcosahedronGeometry;
