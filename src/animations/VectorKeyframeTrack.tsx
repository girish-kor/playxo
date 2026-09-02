// playxo/src/animations/VectorKeyframeTrack.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface VectorKeyframeTrackProps {
  /** Name of the track (e.g., "position", "scale") */
  name: string;
  /** Array of time values (seconds) */
  times: number[];
  /** Array of vector values (flattened) */
  values: number[];
  /** Interpolation type */
  interpolation?: THREE.InterpolationModes;

  /** Called when track changes */
  onChange?: (track: THREE.VectorKeyframeTrack) => void;
}

export interface VectorKeyframeTrackRef {
  track: THREE.VectorKeyframeTrack | null;
  update: () => void;
}

const VectorKeyframeTrack = forwardRef<
  VectorKeyframeTrackRef,
  VectorKeyframeTrackProps
>(
  (
    { name, times, values, interpolation = THREE.InterpolateLinear, onChange },
    ref,
  ) => {
    const trackRef = useRef<THREE.VectorKeyframeTrack | null>(null);

    const handleChange = useCallback(
      (track: THREE.VectorKeyframeTrack) => {
        if (onChange) onChange(track);
      },
      [onChange],
    );

    useEffect(() => {
      const track = new THREE.VectorKeyframeTrack(
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
          const track = new THREE.VectorKeyframeTrack(
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

VectorKeyframeTrack.displayName = "VectorKeyframeTrack";

export default VectorKeyframeTrack;
