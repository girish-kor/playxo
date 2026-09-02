/* eslint-disable react/prop-types */
// playxo/src/animations/AnimationTransition.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";

export interface AnimationTransitionProps {
  /** Name of the state to transition from */
  from: string;
  /** Name of the state to transition to */
  to: string;
  /** Duration of the transition (seconds) */
  duration?: number;
  /** Condition function to trigger transition */
  condition?: () => boolean;
  /** Whether the transition is enabled */
  enabled?: boolean;

  /** Called when transition starts */
  onStart?: () => void;
  /** Called when transition completes */
  onComplete?: () => void;

  /** Whether the transition is active */
  active?: boolean;
}

export interface AnimationTransitionRef {
  from: string;
  to: string;
  transitioning: boolean;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  /** Manually trigger the transition */
  trigger: () => void;
}

const AnimationTransition = forwardRef<
  AnimationTransitionRef,
  AnimationTransitionProps
>(
  (
    {
      from,
      to,
      duration = 0.3,
      condition,
      enabled = true,
      onStart,
      onComplete,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [isEnabled, setIsEnabled] = useState<boolean>(enabled);

    const timerRef = useRef<number | null>(null);
    const conditionCheckRef = useRef<number | null>(null);

    const handleStart = useCallback(() => {
      if (onStart) onStart();
    }, [onStart]);

    const handleComplete = useCallback(() => {
      setIsTransitioning(false);
      if (onComplete) onComplete();
    }, [onComplete]);

    const trigger = useCallback(() => {
      if (!isEnabled || isTransitioning) return;
      setIsTransitioning(true);
      handleStart();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = window.setTimeout(() => {
        handleComplete();
        timerRef.current = null;
      }, duration * 1000);
    }, [isEnabled, isTransitioning, duration, handleStart, handleComplete]);

    // Condition checking
    useEffect(() => {
      if (!condition || !isActive || !isEnabled) return;

      const checkCondition = () => {
        if (condition() && !isTransitioning) {
          trigger();
        }
      };

      conditionCheckRef.current = window.setInterval(checkCondition, 100);
      return () => {
        if (conditionCheckRef.current) {
          clearInterval(conditionCheckRef.current);
          conditionCheckRef.current = null;
        }
      };
    }, [condition, isActive, isEnabled, isTransitioning, trigger]);

    // Cleanup
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (conditionCheckRef.current) {
          clearInterval(conditionCheckRef.current);
          conditionCheckRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      setIsEnabled(enabled);
    }, [enabled]);

    useImperativeHandle(
      ref,
      () => ({
        from,
        to,
        transitioning: isTransitioning,
        enabled: isEnabled,
        setEnabled: (enabled: boolean) => setIsEnabled(enabled),
        trigger,
      }),
      [from, to, isTransitioning, isEnabled, trigger],
    );

    return null;
  },
);

AnimationTransition.displayName = "AnimationTransition";

export default AnimationTransition;
