// playxo/src/animations/NumberKeyframeTrack.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface NumberKeyframeTrackProps {
  /** Name of the track */
  name: string;
  /** Array of time values (seconds) */
  times: number[];
  /** Array of number values */
  values: number[];
  /** Interpolation type */
  interpolation?: THREE.InterpolationModes;

  /** Called when track changes */
  onChange?: (track: THREE.NumberKeyframeTrack) => void;
}

export interface NumberKeyframeTrackRef {
  track: THREE.NumberKeyframeTrack | null;
  update: () => void;
}

const NumberKeyframeTrack = forwardRef<
  NumberKeyframeTrackRef,
  NumberKeyframeTrackProps
>(
  (
    { name, times, values, interpolation = THREE.InterpolateLinear, onChange },
    ref,
  ) => {
    const trackRef = useRef<THREE.NumberKeyframeTrack | null>(null);

    const handleChange = useCallback(
      (track: THREE.NumberKeyframeTrack) => {
        if (onChange) onChange(track);
      },
      [onChange],
    );

    useEffect(() => {
      const track = new THREE.NumberKeyframeTrack(
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
          const track = new THREE.NumberKeyframeTrack(
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

NumberKeyframeTrack.displayName = "NumberKeyframeTrack";

export default NumberKeyframeTrack;
