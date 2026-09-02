// play-kit/src/core/AmbientLight.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface AmbientLightProps {
  /** Color of the light (string, number, or Color) */
  color?: string | number | THREE.Color;
  /** Intensity of the light */
  intensity?: number;
  /** Whether the light is enabled */
  enabled?: boolean;

  /** Called when light properties change */
  onChange?: (light: THREE.AmbientLight) => void;
  /** Called each frame while active */
  onUpdate?: (light: THREE.AmbientLight, delta: number) => void;

  /** Whether the light is active (enables onUpdate loop) */
  active?: boolean;
}

export interface AmbientLightRef {
  /** The underlying Three.js AmbientLight */
  light: THREE.AmbientLight | null;
  /** Whether the light is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const AmbientLight = forwardRef<AmbientLightRef, AmbientLightProps>(
  (
    {
      color = 0xffffff,
      intensity = 0.5,
      enabled = true,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const lightRef = useRef<THREE.AmbientLight | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (light: THREE.AmbientLight) => {
        if (onChange) onChange(light);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (light: THREE.AmbientLight, delta: number) => {
        if (onUpdate) onUpdate(light, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const light = new THREE.AmbientLight();
      lightRef.current = light;
      setIsActive(active);

      light.color = new THREE.Color(color);
      light.intensity = intensity;
      (light as any).enabled = enabled; // type workaround
      handleChange(light);

      return () => {
        lightRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.color = new THREE.Color(color);
      handleChange(light);
    }, [color, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.intensity = intensity;
      handleChange(light);
    }, [intensity, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      (light as any).enabled = enabled;
      handleChange(light);
    }, [enabled, handleChange]);

    useEffect(() => {
      setIsActive(active);
    }, [active]);

    useEffect(() => {
      if (!onUpdate || !isActive) return;

      const loop = (time: number) => {
        const light = lightRef.current;
        if (light) {
          const delta = time - prevTimeRef.current;
          prevTimeRef.current = time;
          handleUpdate(light, delta);
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
    }, [onUpdate, isActive, handleUpdate]);

    useImperativeHandle(
      ref,
      () => ({
        light: lightRef.current,
        active: isActive,
        setActive: (active: boolean) => {
          setIsActive(active);
        },
        update: () => {
          const light = lightRef.current;
          if (light) {
            handleChange(light);
          }
        },
      }),
      [isActive, handleChange],
    );

    return null;
  },
);

AmbientLight.displayName = "AmbientLight";

export default AmbientLight;
