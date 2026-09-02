// play-kit/src/loaders/TGALoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { TGALoader as ThreeTGALoader } from "three/examples/jsm/loaders/TGALoader.js";
import type { Texture } from "three";

export interface TGALoaderProps {
  src: string;
  onLoad?: (texture: Texture) => void;
  onError?: (error: Error) => void;
}

export interface TGALoaderRef {
  texture: Texture | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const TGALoader = forwardRef<TGALoaderRef, TGALoaderProps>(
  ({ src, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const textureRef = useRef<Texture | null>(null);

    const handleLoad = useCallback(
      (texture: Texture) => {
        textureRef.current = texture;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(texture);
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
      const loader = new ThreeTGALoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        texture: textureRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

TGALoader.displayName = "TGALoader";

export default TGALoader;
