// play-kit/src/loaders/FontLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { FontLoader as ThreeFontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import type { Font } from "three/examples/jsm/loaders/FontLoader.js";

export interface FontLoaderProps {
  src: string;
  onLoad?: (font: Font) => void;
  onError?: (error: Error) => void;
}

export interface FontLoaderRef {
  font: Font | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const FontLoader = forwardRef<FontLoaderRef, FontLoaderProps>(
  ({ src, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const fontRef = useRef<Font | null>(null);

    const handleLoad = useCallback(
      (font: Font) => {
        fontRef.current = font;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(font);
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
      const loader = new ThreeFontLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        font: fontRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

FontLoader.displayName = "FontLoader";

export default FontLoader;
