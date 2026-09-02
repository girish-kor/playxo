// play-kit/src/loaders/LottieLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { LottieLoader as ThreeLottieLoader } from "three/examples/jsm/loaders/LottieLoader.js";

// LottieLoader returns an Object3D, but we'll use any for simplicity
export type AnimationObject = any;

export interface LottieLoaderProps {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  onLoad?: (animation: AnimationObject) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface LottieLoaderRef {
  animation: AnimationObject | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
  playing: boolean;
  paused: boolean;
}

const LottieLoader = forwardRef<LottieLoaderRef, LottieLoaderProps>(
  (
    { src, autoplay = false, loop = false, onLoad, onError, onComplete },
    ref,
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(true);
    const animationRef = useRef<AnimationObject | null>(null);

    const handleLoad = useCallback(
      (animation: AnimationObject) => {
        animationRef.current = animation;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (autoplay) {
          if (typeof animation.play === "function") {
            animation.play();
            setPlaying(true);
            setPaused(false);
          }
        }
        if (onLoad) onLoad(animation);
      },
      [onLoad, autoplay],
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
      const loader = new ThreeLottieLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        animation: animationRef.current,
        loading,
        loaded,
        error,
        playing,
        paused,
      }),
      [loading, loaded, error, playing, paused],
    );

    return null;
  },
);

LottieLoader.displayName = "LottieLoader";

export default LottieLoader;
