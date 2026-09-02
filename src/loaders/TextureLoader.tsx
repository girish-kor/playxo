// play-kit/src/loaders/TextureLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { TextureLoader as ThreeTextureLoader } from "three";
import type { Texture } from "three";

export interface TextureLoaderProps {
  src: string;
  crossOrigin?: string;
  onLoad?: (texture: Texture) => void;
  onError?: (error: Error) => void;
}

export interface TextureLoaderRef {
  texture: Texture | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const TextureLoader = forwardRef<TextureLoaderRef, TextureLoaderProps>(
  ({ src, crossOrigin, onLoad, onError }, ref) => {
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
      const loader = new ThreeTextureLoader();
      if (crossOrigin) loader.setCrossOrigin(crossOrigin);
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, crossOrigin, handleLoad, handleError]);

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

TextureLoader.displayName = "TextureLoader";

export default TextureLoader;
