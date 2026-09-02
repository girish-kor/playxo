// playxo/src/animations/StringKeyframeTrack.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface StringKeyframeTrackProps {
  /** Name of the track */
  name: string;
  /** Array of time values (seconds) */
  times: number[];
  /** Array of string values */
  values: string[];
  /** Interpolation type */
  interpolation?: THREE.InterpolationModes;

  /** Called when track changes */
  onChange?: (track: THREE.StringKeyframeTrack) => void;
}

export interface StringKeyframeTrackRef {
  track: THREE.StringKeyframeTrack | null;
  update: () => void;
}

const StringKeyframeTrack = forwardRef<
  StringKeyframeTrackRef,
  StringKeyframeTrackProps
>(
  (
    {
      name,
      times,
      values,
      interpolation = THREE.InterpolateDiscrete,
      onChange,
    },
    ref,
  ) => {
    const trackRef = useRef<THREE.StringKeyframeTrack | null>(null);

    const handleChange = useCallback(
      (track: THREE.StringKeyframeTrack) => {
        if (onChange) onChange(track);
      },
      [onChange],
    );

    useEffect(() => {
      const track = new THREE.StringKeyframeTrack(
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
          const track = new THREE.StringKeyframeTrack(
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

StringKeyframeTrack.displayName = "StringKeyframeTrack";

export default StringKeyframeTrack;
