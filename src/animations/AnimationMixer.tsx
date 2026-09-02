// playxo/src/animations/AnimationMixer.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface AnimationMixerProps {
  /** Target object to animate */
  target: THREE.Object3D;
  /** Time scale (speed multiplier) */
  timeScale?: number;
  /** Child AnimationAction components */
  children?: React.ReactNode;

  /** Called when mixer updates */
  onUpdate?: (mixer: THREE.AnimationMixer, delta: number) => void;
  /** Called when any animation loops */
  onLoop?: (event: any) => void;
  /** Called when any animation finishes */
  onFinished?: (event: any) => void;

  /** Whether the mixer is active (enables onUpdate loop) */
  active?: boolean;
}

export interface AnimationMixerRef {
  mixer: THREE.AnimationMixer | null;
  active: boolean;
  setActive: (active: boolean) => void;
  update: (delta: number) => void;
  stopAll: () => void;
  getActions: () => { [name: string]: THREE.AnimationAction };
}

const AnimationMixer = forwardRef<AnimationMixerRef, AnimationMixerProps>(
  (
    {
      target,
      timeScale = 1,
      children,
      onUpdate,
      onLoop,
      onFinished,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleUpdate = useCallback(
      (mixer: THREE.AnimationMixer, delta: number) => {
        if (onUpdate) onUpdate(mixer, delta);
      },
      [onUpdate],
    );

    const handleLoop = useCallback(
      (event: any) => {
        if (onLoop) onLoop(event);
      },
      [onLoop],
    );

    const handleFinished = useCallback(
      (event: any) => {
        if (onFinished) onFinished(event);
      },
      [onFinished],
    );

    // Create mixer
    useEffect(() => {
      const mixer = new THREE.AnimationMixer(target);
      mixer.timeScale = timeScale;
      mixerRef.current = mixer;
      setIsActive(active);

      // Add event listeners
      mixer.addEventListener("loop", handleLoop);
      mixer.addEventListener("finished", handleFinished);

      return () => {
        mixer.removeEventListener("loop", handleLoop);
        mixer.removeEventListener("finished", handleFinished);
        mixer.stopAllAction();
        mixerRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only once

    // Sync timeScale
    useEffect(() => {
      const mixer = mixerRef.current;
      if (!mixer) return;
      mixer.timeScale = timeScale;
    }, [timeScale]);

    // Sync active
    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Animation loop
    useEffect(() => {
      if (!isActive) return;

      const loop = (time: number) => {
        const mixer = mixerRef.current;
        if (mixer) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          mixer.update(delta);
          handleUpdate(mixer, delta);
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
    }, [isActive, handleUpdate]);

    const stopAll = useCallback(() => {
      const mixer = mixerRef.current;
      if (mixer) mixer.stopAllAction();
    }, []);

    const getActions = useCallback(() => {
      const mixer = mixerRef.current;
      if (!mixer) return {};
      // @ts-expect-error - private property access
      return mixer._actions || {};
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        mixer: mixerRef.current,
        active: isActive,
        setActive: (active: boolean) => setIsActive(active),
        update: (delta: number) => {
          const mixer = mixerRef.current;
          if (mixer) {
            mixer.update(delta);
            handleUpdate(mixer, delta);
          }
        },
        stopAll,
        getActions,
      }),
      [isActive, handleUpdate, stopAll, getActions],
    );

    return null;
  },
);

AnimationMixer.displayName = "AnimationMixer";

export default AnimationMixer;
