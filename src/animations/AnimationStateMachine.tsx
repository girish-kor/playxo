// playxo/src/animations/AnimationStateMachine.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";

export interface AnimationState {
  name: string;
  /** Entry action */
  onEnter?: () => void;
  /** Exit action */
  onExit?: () => void;
  /** Update action */
  onUpdate?: (delta: number) => void;
}

export interface AnimationStateMachineProps {
  /** Initial state name */
  initialState: string;
  /** State definitions */
  states?: { [name: string]: AnimationState };
  /** Child AnimationState components */
  children?: React.ReactNode;
  /** Transitions (array of transition objects) */
  transitions?: any[];

  /** Called when entering a state */
  onStateEnter?: (stateName: string) => void;
  /** Called when exiting a state */
  onStateExit?: (stateName: string) => void;
  /** Called on transition */
  onTransition?: (from: string, to: string) => void;

  /** Whether the state machine is active */
  active?: boolean;
}

export interface AnimationStateMachineRef {
  currentState: string | null;
  states: { [name: string]: AnimationState };
  active: boolean;
  setActive: (active: boolean) => void;
  /** Transition to a specific state */
  transitionTo: (stateName: string) => void;
  /** Get current state object */
  getState: (name: string) => AnimationState | undefined;
  /** Update the state machine (call in animation loop) */
  update: (delta: number) => void;
}

const AnimationStateMachine = forwardRef<
  AnimationStateMachineRef,
  AnimationStateMachineProps
>(
  (
    {
      initialState,
      states = {},
      children,
      transitions = [],
      onStateEnter,
      onStateExit,
      onTransition,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [currentStateName, setCurrentStateName] = useState<string | null>(
      initialState,
    );
    const [previousStateName, setPreviousStateName] = useState<string | null>(
      null,
    );

    const statesRef = useRef<{ [name: string]: AnimationState }>(states);
    const transitionsRef = useRef<any[]>(transitions);

    const handleStateEnter = useCallback(
      (stateName: string) => {
        if (onStateEnter) onStateEnter(stateName);
      },
      [onStateEnter],
    );

    const handleStateExit = useCallback(
      (stateName: string) => {
        if (onStateExit) onStateExit(stateName);
      },
      [onStateExit],
    );

    const handleTransition = useCallback(
      (from: string, to: string) => {
        if (onTransition) onTransition(from, to);
      },
      [onTransition],
    );

    // Transition to a state
    const transitionTo = useCallback(
      (stateName: string) => {
        if (!isActive) return;
        if (stateName === currentStateName) return;
        if (!statesRef.current[stateName]) {
          console.warn(`State "${stateName}" not found in state machine`);
          return;
        }

        // Exit current state
        const currentState = currentStateName
          ? statesRef.current[currentStateName]
          : null;
        if (currentState && currentState.onExit) {
          currentState.onExit();
        }
        if (currentStateName) {
          handleStateExit(currentStateName);
        }

        // Save previous
        setPreviousStateName(currentStateName);

        // Enter new state
        const newState = statesRef.current[stateName];
        if (newState && newState.onEnter) {
          newState.onEnter();
        }
        setCurrentStateName(stateName);
        handleStateEnter(stateName);
        if (previousStateName) {
          handleTransition(previousStateName, stateName);
        }
      },
      [
        isActive,
        currentStateName,
        previousStateName,
        handleStateEnter,
        handleStateExit,
        handleTransition,
      ],
    );

    // Initialize with initialState
    useEffect(() => {
      if (initialState && statesRef.current[initialState]) {
        const state = statesRef.current[initialState];
        if (state.onEnter) state.onEnter();
        setCurrentStateName(initialState);
        handleStateEnter(initialState);
      }
      setIsActive(active);

      return () => {
        // Exit current state on unmount
        const currentState = currentStateName
          ? statesRef.current[currentStateName]
          : null;
        if (currentState && currentState.onExit) {
          currentState.onExit();
        }
        if (currentStateName) {
          handleStateExit(currentStateName);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync states and transitions from props
    useEffect(() => {
      statesRef.current = states;
    }, [states]);

    useEffect(() => {
      transitionsRef.current = transitions;
    }, [transitions]);

    // Check transitions
    useEffect(() => {
      if (!isActive) return;
      // Automatically check transitions if we have conditions
      const checkTransitions = () => {
        for (const transition of transitionsRef.current) {
          if (transition.from === currentStateName) {
            // If condition is a function and returns true, or if no condition
            const shouldTransition = transition.condition
              ? transition.condition()
              : true;
            if (shouldTransition && transition.to) {
              transitionTo(transition.to);
              break;
            }
          }
        }
      };

      const intervalId = window.setInterval(checkTransitions, 50);
      return () => clearInterval(intervalId);
    }, [isActive, currentStateName, transitionTo]);

    // Update function to be called from animation loop
    const update = useCallback(
      (delta: number) => {
        if (!isActive) return;
        const currentState = currentStateName
          ? statesRef.current[currentStateName]
          : null;
        if (currentState && currentState.onUpdate) {
          currentState.onUpdate(delta);
        }
      },
      [isActive, currentStateName],
    );

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useImperativeHandle(
      ref,
      () => ({
        currentState: currentStateName,
        states: statesRef.current,
        active: isActive,
        setActive: (active: boolean) => setIsActive(active),
        transitionTo,
        getState: (name: string) => statesRef.current[name],
        update,
      }),
      [currentStateName, isActive, transitionTo, update],
    );

    return null;
  },
);

AnimationStateMachine.displayName = "AnimationStateMachine";

export default AnimationStateMachine;
