// play-kit/src/geometries/TextGeometry.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import type { Font } from "three/examples/jsm/loaders/FontLoader.js";

export interface TextGeometryProps {
  text: string;
  font: Font;
  size?: number;
  height?: number;
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  onChange?: (geometry: TextGeometry) => void;
}

export interface TextGeometryRef {
  geometry: TextGeometry | null;
  update: () => void;
}

const TextGeometryComponent = forwardRef<TextGeometryRef, TextGeometryProps>(
  (
    {
      text,
      font,
      size = 1,
      height = 0.5,
      curveSegments = 12,
      bevelEnabled = false,
      bevelThickness = 0.1,
      bevelSize = 0.05,
      bevelSegments = 3,
      onChange,
    },
    ref,
  ) => {
    const geometryRef = useRef<TextGeometry | null>(null);

    const handleChange = useCallback(
      (geometry: TextGeometry) => {
        if (onChange) onChange(geometry);
      },
      [onChange],
    );

    useEffect(() => {
      if (!font) return;
      const geometry = new TextGeometry(text, {
        font,
        size,
        height,
        curveSegments,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelSegments,
      });
      geometryRef.current = geometry;
      handleChange(geometry);
    }, [
      text,
      font,
      size,
      height,
      curveSegments,
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelSegments,
      handleChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        update: () => {
          if (!font) return;
          const geometry = new TextGeometry(text, {
            font,
            size,
            height,
            curveSegments,
            bevelEnabled,
            bevelThickness,
            bevelSize,
            bevelSegments,
          });
          geometryRef.current = geometry;
          handleChange(geometry);
        },
      }),
      [
        text,
        font,
        size,
        height,
        curveSegments,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelSegments,
        handleChange,
      ],
    );

    return null;
  },
);

TextGeometryComponent.displayName = "TextGeometry";

export default TextGeometryComponent;
