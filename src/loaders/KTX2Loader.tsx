// play-kit/src/loaders/KTX2Loader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { KTX2Loader as ThreeKTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import type { Texture } from "three";

export interface KTX2LoaderProps {
  src: string;
  transcoderPath?: string;
  onLoad?: (texture: Texture) => void;
  onError?: (error: Error) => void;
}

export interface KTX2LoaderRef {
  texture: Texture | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const KTX2Loader = forwardRef<KTX2LoaderRef, KTX2LoaderProps>(
  ({ src, transcoderPath, onLoad, onError }, ref) => {
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
      const loader = new ThreeKTX2Loader();
      if (transcoderPath) loader.setTranscoderPath(transcoderPath);
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);

      // No dispose method, but we can nullify
    }, [src, transcoderPath, handleLoad, handleError]);

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

KTX2Loader.displayName = "KTX2Loader";

export default KTX2Loader;
