/* eslint-disable react/prop-types */
// playxo/src/animations/AnimationAction.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface AnimationActionProps {
  /** Animation clip to play */
  clip: THREE.AnimationClip;
  /** Whether to loop */
  loop?: boolean;
  /** Number of loops (0 = infinite) */
  loopCount?: number;
  /** Time scale for this action */
  timeScale?: number;
  /** Weight (influence) of this action */
  weight?: number;
  /** Fade-in duration (seconds) */
  fadeIn?: number;
  /** Fade-out duration (seconds) */
  fadeOut?: number;
  /** Whether to play immediately */
  autoPlay?: boolean;
  /** Whether the action is enabled */
  enabled?: boolean;

  /** Called when action starts */
  onStart?: (action: THREE.AnimationAction) => void;
  /** Called when action loops */
  onLoop?: (action: THREE.AnimationAction) => void;
  /** Called when action finishes */
  onFinish?: (action: THREE.AnimationAction) => void;
  /** Called when action updates */
  onUpdate?: (action: THREE.AnimationAction, delta: number) => void;

  /** Whether the action is active */
  active?: boolean;
}

export interface AnimationActionRef {
  action: THREE.AnimationAction | null;
  playing: boolean;
  paused: boolean;
  stopped: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setActive: (active: boolean) => void;
}

const AnimationAction = forwardRef<AnimationActionRef, AnimationActionProps>(
  (
    {
      clip,
      loop = true,
      loopCount = Infinity,
      timeScale = 1,
      weight = 1,
      fadeIn = 0,
      fadeOut = 0,
      autoPlay = true,
      enabled = true,
      onStart,
      onLoop,
      onFinish,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isStopped, setIsStopped] = useState<boolean>(true);

    const actionRef = useRef<THREE.AnimationAction | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleStart = useCallback(
      (action: THREE.AnimationAction) => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsStopped(false);
        if (onStart) onStart(action);
      },
      [onStart],
    );

    const handleLoop = useCallback(
      (action: THREE.AnimationAction) => {
        if (onLoop) onLoop(action);
      },
      [onLoop],
    );

    const handleFinish = useCallback(
      (action: THREE.AnimationAction) => {
        setIsPlaying(false);
        setIsPaused(false);
        setIsStopped(true);
        if (onFinish) onFinish(action);
      },
      [onFinish],
    );

    const handleUpdate = useCallback(
      (action: THREE.AnimationAction, delta: number) => {
        if (onUpdate) onUpdate(action, delta);
      },
      [onUpdate],
    );

    // Create action
    useEffect(() => {
      const dummyTarget = new THREE.Object3D();
      const mixer = new THREE.AnimationMixer(dummyTarget);
      mixerRef.current = mixer;
      const action = mixer.clipAction(clip);
      actionRef.current = action;

      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loopCount);
      action.timeScale = timeScale;
      action.weight = weight;
      action.enabled = enabled;

      // Listen to mixer events and filter by action
      const onMixerLoop = (e: any) => {
        if (e.action === action) {
          handleLoop(action);
        }
      };
      const onMixerFinished = (e: any) => {
        if (e.action === action) {
          handleFinish(action);
        }
      };

      mixer.addEventListener("loop", onMixerLoop);
      mixer.addEventListener("finished", onMixerFinished);

      if (autoPlay) {
        action.play();
        handleStart(action);
      }

      return () => {
        mixer.removeEventListener("loop", onMixerLoop);
        mixer.removeEventListener("finished", onMixerFinished);
        action.stop();
        mixer.uncacheClip(clip);
        mixerRef.current = null;
        actionRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync props
    useEffect(() => {
      const action = actionRef.current;
      if (!action) return;
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loopCount);
    }, [loop, loopCount]);

    useEffect(() => {
      const action = actionRef.current;
      if (!action) return;
      action.timeScale = timeScale;
    }, [timeScale]);

    useEffect(() => {
      const action = actionRef.current;
      if (!action) return;
      action.weight = weight;
    }, [weight]);

    useEffect(() => {
      const action = actionRef.current;
      if (!action) return;
      action.enabled = enabled;
    }, [enabled]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Update loop (just for onUpdate callback)
    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const action = actionRef.current;
        if (action && isPlaying) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(action, delta);
        }
        animFrameRef.current = requestAnimationFrame(loop);
      };

      prevTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      };
    }, [onUpdate, isActive, isPlaying, handleUpdate]);

    // Imperative methods
    const play = useCallback(() => {
      const action = actionRef.current;
      if (action) {
        if (fadeIn > 0) {
          action.fadeIn(fadeIn);
        } else {
          action.play();
        }
        setIsPlaying(true);
        setIsPaused(false);
        setIsStopped(false);
        handleStart(action);
      }
    }, [fadeIn, handleStart]);

    const pause = useCallback(() => {
      const action = actionRef.current;
      if (action) {
        action.paused = true;
        setIsPaused(true);
        setIsPlaying(false);
      }
    }, []);

    const stop = useCallback(() => {
      const action = actionRef.current;
      if (action) {
        if (fadeOut > 0) {
          action.fadeOut(fadeOut);
        } else {
          action.stop();
        }
        setIsPlaying(false);
        setIsPaused(false);
        setIsStopped(true);
        handleFinish(action);
      }
    }, [fadeOut, handleFinish]);

    useImperativeHandle(
      ref,
      () => ({
        action: actionRef.current,
        playing: isPlaying,
        paused: isPaused,
        stopped: isStopped,
        play,
        pause,
        stop,
        setActive: (active: boolean) => setIsActive(active),
      }),
      [isPlaying, isPaused, isStopped, play, pause, stop],
    );

    return null;
  },
);

AnimationAction.displayName = "AnimationAction";

export default AnimationAction;
