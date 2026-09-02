// play-kit/src/loaders/ImageBitmapLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { ImageBitmapLoader as ThreeImageBitmapLoader } from "three";

export interface ImageBitmapLoaderProps {
  src: string;
  onLoad?: (imageBitmap: ImageBitmap) => void;
  onError?: (error: Error) => void;
}

export interface ImageBitmapLoaderRef {
  imageBitmap: ImageBitmap | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const ImageBitmapLoader = forwardRef<
  ImageBitmapLoaderRef,
  ImageBitmapLoaderProps
>(({ src, onLoad, onError }, ref) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const imageBitmapRef = useRef<ImageBitmap | null>(null);

  const handleLoad = useCallback(
    (imageBitmap: ImageBitmap) => {
      imageBitmapRef.current = imageBitmap;
      setLoading(false);
      setLoaded(true);
      setError(null);
      if (onLoad) onLoad(imageBitmap);
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
    const loader = new ThreeImageBitmapLoader();
    setLoading(true);
    setLoaded(false);
    setError(null);
    loader.load(src, handleLoad, undefined, handleError);
  }, [src, handleLoad, handleError]);

  useImperativeHandle(
    ref,
    () => ({
      imageBitmap: imageBitmapRef.current,
      loading,
      loaded,
      error,
    }),
    [loading, loaded, error],
  );

  return null;
});

ImageBitmapLoader.displayName = "ImageBitmapLoader";

export default ImageBitmapLoader;
