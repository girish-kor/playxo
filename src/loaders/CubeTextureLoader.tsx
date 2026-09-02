// play-kit/src/loaders/CubeTextureLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { CubeTextureLoader as ThreeCubeTextureLoader } from "three";
import type { CubeTexture } from "three";

export interface CubeTextureLoaderProps {
  urls: string[];
  onLoad?: (texture: CubeTexture) => void;
  onError?: (error: Error) => void;
}

export interface CubeTextureLoaderRef {
  texture: CubeTexture | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const CubeTextureLoader = forwardRef<
  CubeTextureLoaderRef,
  CubeTextureLoaderProps
>(({ urls, onLoad, onError }, ref) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const textureRef = useRef<CubeTexture | null>(null);

  const handleLoad = useCallback(
    (texture: CubeTexture) => {
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
    if (!urls || urls.length === 0) return;
    const loader = new ThreeCubeTextureLoader();
    setLoading(true);
    setLoaded(false);
    setError(null);
    loader.load(urls, handleLoad, undefined, handleError);
  }, [urls, handleLoad, handleError]);

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
});

CubeTextureLoader.displayName = "CubeTextureLoader";

export default CubeTextureLoader;
