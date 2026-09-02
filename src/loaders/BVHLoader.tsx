// play-kit/src/loaders/BVHLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { BVHLoader as ThreeBVHLoader } from "three/examples/jsm/loaders/BVHLoader.js";

// Define the result type based on BVHLoader's actual output
export interface BVHLoaderResult {
  skeleton: any; // Use proper types if needed
  clip: any;
}

export interface BVHLoaderProps {
  src: string;
  onLoad?: (result: BVHLoaderResult) => void;
  onError?: (error: Error) => void;
}

export interface BVHLoaderRef {
  result: BVHLoaderResult | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const BVHLoader = forwardRef<BVHLoaderRef, BVHLoaderProps>(
  ({ src, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const resultRef = useRef<BVHLoaderResult | null>(null);

    const handleLoad = useCallback(
      (result: BVHLoaderResult) => {
        resultRef.current = result;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(result);
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
      const loader = new ThreeBVHLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        result: resultRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

BVHLoader.displayName = "BVHLoader";

export default BVHLoader;
