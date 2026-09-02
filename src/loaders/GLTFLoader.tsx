// play-kit/src/loaders/GLTFLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { GLTFLoader as ThreeGLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface GLTFLoaderProps {
  src: string;
  draco?: boolean;
  ktx2?: boolean;
  dracoDecoderPath?: string;
  ktx2TranscoderPath?: string;
  onLoad?: (gltf: GLTF) => void;
  onProgress?: (event: ProgressEvent) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface GLTFLoaderRef {
  gltf: GLTF | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const GLTFLoader = forwardRef<GLTFLoaderRef, GLTFLoaderProps>(
  (
    {
      src,
      draco = false,
      ktx2 = false,
      dracoDecoderPath,
      ktx2TranscoderPath,
      onLoad,
      onProgress,
      onError,
      onComplete,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const gltfRef = useRef<GLTF | null>(null);

    const handleLoad = useCallback(
      (gltf: GLTF) => {
        gltfRef.current = gltf;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(gltf);
        if (onComplete) onComplete();
      },
      [onLoad, onComplete],
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

      const loader = new ThreeGLTFLoader();

      // Draco support
      let dracoLoader: DRACOLoader | null = null;
      if (draco) {
        dracoLoader = new DRACOLoader();
        if (dracoDecoderPath) {
          dracoLoader.setDecoderPath(dracoDecoderPath);
        }
        loader.setDRACOLoader(dracoLoader);
      }

      // KTX2 support
      let ktx2Loader: KTX2Loader | null = null;
      if (ktx2) {
        ktx2Loader = new KTX2Loader();
        if (ktx2TranscoderPath) {
          ktx2Loader.setTranscoderPath(ktx2TranscoderPath);
        }
        loader.setKTX2Loader(ktx2Loader);
      }

      setLoading(true);
      setLoaded(false);
      setError(null);

      loader.load(src, handleLoad, handleProgress, handleError);

      return () => {
        if (dracoLoader) dracoLoader.dispose();
        if (ktx2Loader) ktx2Loader.dispose();
      };
    }, [
      src,
      draco,
      ktx2,
      dracoDecoderPath,
      ktx2TranscoderPath,
      handleLoad,
      handleProgress,
      handleError,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        gltf: gltfRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

GLTFLoader.displayName = "GLTFLoader";

export default GLTFLoader;
