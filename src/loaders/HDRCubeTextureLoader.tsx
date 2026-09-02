// play-kit/src/loaders/HDRCubeTextureLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { HDRCubeTextureLoader as ThreeHDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader.js";
import type { CubeTexture } from "three";

export interface HDRCubeTextureLoaderProps {
  src: string | string[];
  onLoad?: (texture: CubeTexture) => void;
  onError?: (error: Error) => void;
}

export interface HDRCubeTextureLoaderRef {
  texture: CubeTexture | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const HDRCubeTextureLoader = forwardRef<
  HDRCubeTextureLoaderRef,
  HDRCubeTextureLoaderProps
>(({ src, onLoad, onError }, ref) => {
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
    if (!src) return;
    const loader = new ThreeHDRCubeTextureLoader();
    setLoading(true);
    setLoaded(false);
    setError(null);
    const urls = Array.isArray(src) ? src : [src];
    loader.load(urls, handleLoad, undefined, handleError);
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
});

HDRCubeTextureLoader.displayName = "HDRCubeTextureLoader";

export default HDRCubeTextureLoader;
