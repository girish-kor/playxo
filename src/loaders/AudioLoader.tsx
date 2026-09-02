// play-kit/src/loaders/AudioLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { AudioLoader as ThreeAudioLoader } from "three";

export interface AudioLoaderProps {
  src: string;
  onLoad?: (buffer: AudioBuffer) => void;
  onError?: (error: Error) => void;
}

export interface AudioLoaderRef {
  buffer: AudioBuffer | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

const AudioLoader = forwardRef<AudioLoaderRef, AudioLoaderProps>(
  ({ src, onLoad, onError }, ref) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);

    const handleLoad = useCallback(
      (buffer: AudioBuffer) => {
        bufferRef.current = buffer;
        setLoading(false);
        setLoaded(true);
        setError(null);
        if (onLoad) onLoad(buffer);
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
      const loader = new ThreeAudioLoader();
      setLoading(true);
      setLoaded(false);
      setError(null);
      loader.load(src, handleLoad, undefined, handleError);
    }, [src, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        buffer: bufferRef.current,
        loading,
        loaded,
        error,
      }),
      [loading, loaded, error],
    );

    return null;
  },
);

AudioLoader.displayName = "AudioLoader";

export default AudioLoader;
