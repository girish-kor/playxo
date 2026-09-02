// playxo/src/animations/KeyframeTrack.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface KeyframeTrackProps {
  /** Name of the track (e.g., "position", "scale") */
  name: string;
  /** Array of time values (seconds) */
  times: number[];
  /** Array of values (flattened) */
  values: number[];
  /** Interpolation type */
  interpolation?: THREE.InterpolationModes;

  /** Called when track changes */
  onChange?: (track: THREE.KeyframeTrack) => void;
}

export interface KeyframeTrackRef {
  track: THREE.KeyframeTrack | null;
  update: () => void;
}

const KeyframeTrack = forwardRef<KeyframeTrackRef, KeyframeTrackProps>(
  (
    { name, times, values, interpolation = THREE.InterpolateLinear, onChange },
    ref,
  ) => {
    const trackRef = useRef<THREE.KeyframeTrack | null>(null);

    const handleChange = useCallback(
      (track: THREE.KeyframeTrack) => {
        if (onChange) onChange(track);
      },
      [onChange],
    );

    useEffect(() => {
      const track = new THREE.KeyframeTrack(name, times, values, interpolation);
      trackRef.current = track;
      handleChange(track);

      return () => {
        trackRef.current = null;
      };
    }, [name, times, values, interpolation, handleChange]);

    useImperativeHandle(
      ref,
      () => ({
        track: trackRef.current,
        update: () => {
          const track = new THREE.KeyframeTrack(
            name,
            times,
            values,
            interpolation,
          );
          trackRef.current = track;
          handleChange(track);
        },
      }),
      [name, times, values, interpolation, handleChange],
    );

    return null;
  },
);

KeyframeTrack.displayName = "KeyframeTrack";

export default KeyframeTrack;
