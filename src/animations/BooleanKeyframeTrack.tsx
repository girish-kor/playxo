// playxo/src/animations/BooleanKeyframeTrack.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface BooleanKeyframeTrackProps {
  /** Name of the track */
  name: string;
  /** Array of time values (seconds) */
  times: number[];
  /** Array of boolean values */
  values: boolean[];

  /** Called when track changes */
  onChange?: (track: THREE.BooleanKeyframeTrack) => void;
}

export interface BooleanKeyframeTrackRef {
  track: THREE.BooleanKeyframeTrack | null;
  update: () => void;
}

const BooleanKeyframeTrack = forwardRef<
  BooleanKeyframeTrackRef,
  BooleanKeyframeTrackProps
>(({ name, times, values, onChange }, ref) => {
  const trackRef = useRef<THREE.BooleanKeyframeTrack | null>(null);

  const handleChange = useCallback(
    (track: THREE.BooleanKeyframeTrack) => {
      if (onChange) onChange(track);
    },
    [onChange],
  );

  useEffect(() => {
    const track = new THREE.BooleanKeyframeTrack(name, times, values);
    trackRef.current = track;
    handleChange(track);

    return () => {
      trackRef.current = null;
    };
  }, [name, times, values, handleChange]);

  useImperativeHandle(
    ref,
    () => ({
      track: trackRef.current,
      update: () => {
        const track = new THREE.BooleanKeyframeTrack(name, times, values);
        trackRef.current = track;
        handleChange(track);
      },
    }),
    [name, times, values, handleChange],
  );

  return null;
});

BooleanKeyframeTrack.displayName = "BooleanKeyframeTrack";

export default BooleanKeyframeTrack;
