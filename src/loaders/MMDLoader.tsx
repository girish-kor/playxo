// play-kit/src/loaders/MMDLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { MMDLoader as ThreeMMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";
import type { SkinnedMesh, Object3D } from "three";

export interface MMDLoaderProps {
  src: string;
  onLoad?: (object: Object3D) => void;
  onError?: (error: Error) => void;
}

export interface MMDLoaderRef {
  object: Object3D | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const MMDLoader = forwardRef<MMDLoaderRef, MMDLoaderProps>(
  ({ src, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const objectRef = useRef<Object3D | null>(null);

    const handleLoad = useCallback(
      (object: Object3D) => {
        objectRef.current = object;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(object);
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
      const loader = new ThreeMMDLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      // MMDLoader's load callback returns a SkinnedMesh, which is a subclass of Object3D
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        object: objectRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

MMDLoader.displayName = "MMDLoader";

export default MMDLoader;
