// play-kit/src/loaders/VideoTextureLoader.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import { VideoTexture as ThreeVideoTexture } from "three";

export interface VideoTextureLoaderProps {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  onLoad?: (texture: ThreeVideoTexture) => void;
  onError?: (error: Error) => void;
  onPlay?: (texture: ThreeVideoTexture) => void;
  onPause?: (texture: ThreeVideoTexture) => void;
}

export interface VideoTextureLoaderRef {
  texture: ThreeVideoTexture | null;
  loading: boolean;
  loaded: boolean;
  error: Error | null;
  playing: boolean;
  paused: boolean;
}

const VideoTextureLoader = forwardRef<
  VideoTextureLoaderRef,
  VideoTextureLoaderProps
>(
  (
    { src, autoplay = false, loop = false, onLoad, onError, onPlay, onPause },
    ref,
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(true);
    const textureRef = useRef<ThreeVideoTexture | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleLoad = useCallback(
      (texture: ThreeVideoTexture) => {
        textureRef.current = texture;
        setLoading(false);
        setLoaded(true);
        setError(null);
        const video = texture.image as HTMLVideoElement;
        videoRef.current = video;
        video.addEventListener("play", () => {
          setPlaying(true);
          setPaused(false);
          if (onPlay) onPlay(texture);
        });
        video.addEventListener("pause", () => {
          setPlaying(false);
          setPaused(true);
          if (onPause) onPause(texture);
        });
        if (onLoad) onLoad(texture);
        if (autoplay) video.play();
      },
      [onLoad, autoplay, onPlay, onPause],
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
      setLoading(true);
      setLoaded(false);
      setError(null);
      const video = document.createElement("video");
      video.src = src;
      video.loop = loop;
      video.muted = true;
      const texture = new ThreeVideoTexture(video);
      texture.needsUpdate = true;

      video.onloadeddata = () => {
        handleLoad(texture);
      };
      video.onerror = (e) => {
        handleError(new Error(`Video load error: ${e}`));
      };
      video.load();

      return () => {
        video.pause();
        video.src = "";
        video.load();
        texture.dispose();
      };
    }, [src, loop, handleLoad, handleError]);

    useImperativeHandle(
      ref,
      () => ({
        texture: textureRef.current,
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

VideoTextureLoader.displayName = "VideoTextureLoader";

export default VideoTextureLoader;
