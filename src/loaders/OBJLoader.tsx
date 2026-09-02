// play-kit/src/loaders/OBJLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { OBJLoader as ThreeOBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { Group } from "three";

export interface OBJLoaderProps {
  src: string;
  onLoad?: (object: Group) => void;
  onProgress?: (event: ProgressEvent) => void;
  onError?: (error: Error) => void;
}

export interface OBJLoaderRef {
  object: Group | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const OBJLoader = forwardRef<OBJLoaderRef, OBJLoaderProps>(
  ({ src, onLoad, onProgress, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const objectRef = useRef<Group | null>(null);

    const handleLoad = useCallback(
      (object: Group) => {
        objectRef.current = object;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(object);
      },
      [onLoad],
    );

    const handleProgress = useCallback(
      (event: ProgressEvent) => {
        if (onProgress) onProgress(event);
      },
      [onProgress],
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
      const loader = new ThreeOBJLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, handleProgress, handleError);
    }, [src, handleLoad, handleProgress, handleError]);

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

OBJLoader.displayName = "OBJLoader";

export default OBJLoader;
