// playxo/src/animations/AnimationClip.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface AnimationClipProps {
  /** Name of the clip */
  name?: string;
  /** Duration of the clip (seconds) */
  duration?: number;
  /** Array of keyframe tracks */
  tracks?: THREE.KeyframeTrack[];
  /** Blend mode */
  blendMode?: THREE.AnimationBlendMode;
  /** Child KeyframeTrack components */
  children?: React.ReactNode;

  /** Called when clip is ready */
  onReady?: (clip: THREE.AnimationClip) => void;
  /** Called when clip changes */
  onChange?: (clip: THREE.AnimationClip) => void;

  /** Whether the clip is active */
  active?: boolean;
}

export interface AnimationClipRef {
  clip: THREE.AnimationClip | null;
  ready: boolean;
  active: boolean;
  setActive: (active: boolean) => void;
}

const AnimationClip = forwardRef<AnimationClipRef, AnimationClipProps>(
  (
    {
      name = "",
      duration = 1,
      tracks = [],
      blendMode = THREE.NormalAnimationBlendMode,
      children,
      onReady,
      onChange,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [isReady, setIsReady] = useState<boolean>(false);
    const clipRef = useRef<THREE.AnimationClip | null>(null);

    const handleReady = useCallback(
      (clip: THREE.AnimationClip) => {
        if (onReady) onReady(clip);
      },
      [onReady],
    );

    const handleChange = useCallback(
      (clip: THREE.AnimationClip) => {
        if (onChange) onChange(clip);
      },
      [onChange],
    );

    // Create clip
    useEffect(() => {
      const clip = new THREE.AnimationClip(name, duration, tracks, blendMode);
      clipRef.current = clip;
      setIsReady(true);
      setIsActive(active);
      handleReady(clip);
      handleChange(clip);

      return () => {
        clipRef.current = null;
        setIsReady(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync props
    useEffect(() => {
      const clip = clipRef.current;
      if (!clip) return;
      clip.name = name;
      handleChange(clip);
    }, [name, handleChange]);

    useEffect(() => {
      const clip = clipRef.current;
      if (!clip) return;
      clip.duration = duration;
      handleChange(clip);
    }, [duration, handleChange]);

    useEffect(() => {
      const clip = clipRef.current;
      if (!clip) return;
      clip.tracks = tracks;
      handleChange(clip);
    }, [tracks, handleChange]);

    useEffect(() => {
      const clip = clipRef.current;
      if (!clip) return;
      clip.blendMode = blendMode;
      handleChange(clip);
    }, [blendMode, handleChange]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useImperativeHandle(
      ref,
      () => ({
        clip: clipRef.current,
        ready: isReady,
        active: isActive,
        setActive: (active: boolean) => setIsActive(active),
      }),
      [isActive, isReady],
    );

    return null;
  },
);

AnimationClip.displayName = "AnimationClip";

export default AnimationClip;
