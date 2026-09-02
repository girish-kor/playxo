// playxo/src/animations/QuaternionKeyframeTrack.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface QuaternionKeyframeTrackProps {
  /** Name of the track (e.g., "rotation") */
  name: string;
  /** Array of time values (seconds) */
  times: number[];
  /** Array of quaternion values (flattened: x,y,z,w) */
  values: number[];
  /** Interpolation type */
  interpolation?: THREE.InterpolationModes;

  /** Called when track changes */
  onChange?: (track: THREE.QuaternionKeyframeTrack) => void;
}

export interface QuaternionKeyframeTrackRef {
  track: THREE.QuaternionKeyframeTrack | null;
  update: () => void;
}

const QuaternionKeyframeTrack = forwardRef<
  QuaternionKeyframeTrackRef,
  QuaternionKeyframeTrackProps
>(
  (
    { name, times, values, interpolation = THREE.InterpolateLinear, onChange },
    ref,
  ) => {
    const trackRef = useRef<THREE.QuaternionKeyframeTrack | null>(null);

    const handleChange = useCallback(
      (track: THREE.QuaternionKeyframeTrack) => {
        if (onChange) onChange(track);
      },
      [onChange],
    );

    useEffect(() => {
      const track = new THREE.QuaternionKeyframeTrack(
        name,
        times,
        values,
        interpolation,
      );
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
          const track = new THREE.QuaternionKeyframeTrack(
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

QuaternionKeyframeTrack.displayName = "QuaternionKeyframeTrack";

export default QuaternionKeyframeTrack;
