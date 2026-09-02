// play-kit/src/loaders/MTLLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { MTLLoader as ThreeMTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import type { MTLLoader as MTLLoaderType } from "three/examples/jsm/loaders/MTLLoader.js";

export interface MTLLoaderProps {
  src: string;
  onLoad?: (materialCreator: MTLLoaderType.MaterialCreator) => void;
  onError?: (error: Error) => void;
}

export interface MTLLoaderRef {
  materialCreator: MTLLoaderType.MaterialCreator | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const MTLLoader = forwardRef<MTLLoaderRef, MTLLoaderProps>(
  ({ src, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const materialCreatorRef = useRef<MTLLoaderType.MaterialCreator | null>(
      null,
    );

    const handleLoad = useCallback(
      (creator: MTLLoaderType.MaterialCreator) => {
        materialCreatorRef.current = creator;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(creator);
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
      const loader = new ThreeMTLLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        materialCreator: materialCreatorRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

MTLLoader.displayName = "MTLLoader";

export default MTLLoader;
