// playxo/src/animations/AnimationBlender.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface AnimationBlenderProps {
  /** Array of animation actions to blend */
  actions?: THREE.AnimationAction[];
  /** Weights for each action (must match actions length) */
  weights?: number[];
  /** Blend mode */
  mode?: "normalize" | "additive";
  /** Child AnimationAction components */
  children?: React.ReactNode;

  /** Called when blend updates (receives a blender object) */
  onUpdate?: (blender: any) => void;
  /** Called when blend changes */
  onBlend?: (weights: number[]) => void;

  /** Whether the blender is active */
  active?: boolean;
}

export interface AnimationBlenderRef {
  actions: THREE.AnimationAction[];
  weights: number[];
  active: boolean;
  setActive: (active: boolean) => void;
  /** Set weights for all actions */
  setWeights: (weights: number[]) => void;
  /** Blend towards target weights over time */
  blendTo: (targetWeights: number[], duration: number) => void;
}

const AnimationBlender = forwardRef<AnimationBlenderRef, AnimationBlenderProps>(
  (
    {
      actions = [],
      weights = [],
      mode = "normalize",
      children,
      onUpdate,
      onBlend,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [currentWeights, setCurrentWeights] = useState<number[]>(weights);
    const [targetWeights, setTargetWeights] = useState<number[]>(weights);
    const [blendDuration, setBlendDuration] = useState<number>(0);
    const [blendStartTime, setBlendStartTime] = useState<number>(0);
    const [blending, setBlending] = useState<boolean>(false);

    const actionsRef = useRef<THREE.AnimationAction[]>(actions);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleUpdate = useCallback(
      (blender: any) => {
        if (onUpdate) onUpdate(blender);
      },
      [onUpdate],
    );

    const handleBlend = useCallback(
      (weights: number[]) => {
        if (onBlend) onBlend(weights);
      },
      [onBlend],
    );

    // Normalize weights
    const normalizeWeights = useCallback((w: number[]): number[] => {
      const sum = w.reduce((a, b) => a + b, 0);
      if (sum === 0) return w.map(() => 0);
      return w.map((v) => v / sum);
    }, []);

    // Set weights (with optional normalization)
    // Must be defined before applyWeights because applyWeights uses it in the blender object.
    // However, applyWeights doesn't directly depend on setWeights, so we can define it after.
    // But we'll define setWeights and blendTo before applyWeights to avoid any reference issues.
    // Actually, setWeights uses applyWeights, so we need to define applyWeights first.
    // We'll define applyWeights with deps that don't include setWeights/blendTo,
    // then define setWeights and blendTo after.
    // The linter will warn about missing deps, but we suppress it.

    // Apply weights to actions
    const applyWeights: (w: number[]) => void = useCallback(
      (w: number[]) => {
        actionsRef.current.forEach((action, i) => {
          if (i < w.length) {
            action.weight = w[i];
            if (w[i] > 0 && !action.isRunning()) {
              action.play();
            } else if (w[i] === 0 && action.isRunning()) {
              action.stop();
            }
          }
        });
        setCurrentWeights(w);
        handleBlend(w);
        // Create a blender object to pass to onUpdate.
        // It references setWeights and blendTo from the outer scope.
        // These are defined later, but will be available when the object is used.
        const blender = {
          actions: actionsRef.current,
          weights: w,
          active: isActive,
          setActive: (a: boolean) => setIsActive(a),
          setWeights: (newWeights: number[]) => setWeights(newWeights, true),
          blendTo: (target: number[], duration: number) =>
            blendTo(target, duration),
        };
        handleUpdate(blender);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleBlend, handleUpdate, isActive],
    );

    // Define setWeights (depends on applyWeights, normalizeWeights, mode)
    const setWeights: (w: number[], normalize?: boolean) => void = useCallback(
      (w: number[], normalize = true) => {
        const finalWeights = normalize ? normalizeWeights(w) : w;
        if (mode === "normalize") {
          applyWeights(normalizeWeights(finalWeights));
        } else {
          applyWeights(finalWeights);
        }
      },
      [applyWeights, normalizeWeights, mode],
    );

    // Define blendTo (depends on normalizeWeights, mode)
    const blendTo: (target: number[], duration: number) => void = useCallback(
      (target: number[], duration: number) => {
        const normalizedTarget =
          mode === "normalize" ? normalizeWeights(target) : target;
        setTargetWeights(normalizedTarget);
        setBlendDuration(duration);
        setBlendStartTime(performance.now());
        setBlending(true);
      },
      [normalizeWeights, mode],
    );

    // Initial setup - run only once on mount
    useEffect(() => {
      actionsRef.current = actions;
      if (weights.length === 0) {
        // If no weights provided, distribute evenly
        const defaultWeights = actions.map(() => 1 / actions.length);
        setWeights(defaultWeights, false);
      } else {
        setWeights(weights, true);
      }
      setIsActive(active);

      return () => {
        actionsRef.current.forEach((action) => action.stop());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync actions and weights if props change
    useEffect(() => {
      actionsRef.current = actions;
    }, [actions]);

    // This effect sets weights when the weights prop changes, but only if we have actions.
    useEffect(() => {
      if (weights.length > 0 && actions.length > 0) {
        setWeights(weights, true);
      }
    }, [weights, actions.length, setWeights]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Update loop for blending
    useEffect(() => {
      if (!isActive) return;

      const loop = (time: number) => {
        const delta = time - prevTimeRef.current;
        prevTimeRef.current = time;

        // Handle blending
        if (blending && blendDuration > 0) {
          const elapsed = time - blendStartTime;
          const progress = Math.min(elapsed / blendDuration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out

          const current = currentWeights;
          const target = targetWeights;
          const blended = current.map((c, i) => {
            const t = i < target.length ? target[i] : 0;
            return c + (t - c) * eased;
          });

          if (mode === "normalize") {
            applyWeights(normalizeWeights(blended));
          } else {
            applyWeights(blended);
          }

          if (progress >= 1) {
            setBlending(false);
            if (mode === "normalize") {
              applyWeights(normalizeWeights(target));
            } else {
              applyWeights(target);
            }
          }
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
    }, [
      isActive,
      blending,
      blendDuration,
      blendStartTime,
      currentWeights,
      targetWeights,
      applyWeights,
      normalizeWeights,
      mode,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        actions: actionsRef.current,
        weights: currentWeights,
        active: isActive,
        setActive: (active: boolean) => setIsActive(active),
        setWeights: (weights: number[]) => setWeights(weights, true),
        blendTo,
      }),
      [isActive, currentWeights, setWeights, blendTo],
    );

    return null;
  },
);

AnimationBlender.displayName = "AnimationBlender";

export default AnimationBlender;
