// play-kit/src/loaders/DRACOLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { DRACOLoader as ThreeDRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { BufferGeometry } from "three";

export interface DRACOLoaderProps {
  src: string;
  decoderPath?: string;
  onLoad?: (geometry: BufferGeometry) => void;
  onError?: (error: Error) => void;
}

export interface DRACOLoaderRef {
  geometry: BufferGeometry | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const DRACOLoader = forwardRef<DRACOLoaderRef, DRACOLoaderProps>(
  ({ src, decoderPath, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const geometryRef = useRef<BufferGeometry | null>(null);

    const handleLoad = useCallback(
      (geometry: BufferGeometry) => {
        geometryRef.current = geometry;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(geometry);
      },
      [onLoad],
    );

    const handleError = useCallback(
      (err: unknown) => {
        const error = err instanceof Error ? err : new Error(String(err));
        setLoading(false);
        setLoaded(false);
        setError(error);
        if (onError) onError(error);
      },
      [onError],
    );

    useEffect(() => {
      if (!src) return;
      const loader = new ThreeDRACOLoader();
      if (decoderPath) loader.setDecoderPath(decoderPath);
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, handleError);

      return () => {
        loader.dispose();
      };
    }, [src, decoderPath, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        geometry: geometryRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

DRACOLoader.displayName = "DRACOLoader";

export default DRACOLoader;
