// play-kit/src/core/PointLight.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface PointLightProps {
  /** Color of the light (string, number, or Color) */
  color?: string | number | THREE.Color;
  /** Intensity of the light */
  intensity?: number;
  /** Distance over which light decays */
  distance?: number;
  /** Decay factor */
  decay?: number;
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Whether the light is enabled */
  enabled?: boolean;

  /** Called when light properties change */
  onChange?: (light: THREE.PointLight) => void;
  /** Called each frame while active */
  onUpdate?: (light: THREE.PointLight, delta: number) => void;

  /** Whether the light is active (enables onUpdate loop) */
  active?: boolean;
}

export interface PointLightRef {
  /** The underlying Three.js PointLight */
  light: THREE.PointLight | null;
  /** Whether the light is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const PointLight = forwardRef<PointLightRef, PointLightProps>(
  (
    {
      color = 0xffffff,
      intensity = 1,
      distance = 0,
      decay = 2,
      position = [0, 0, 0],
      enabled = true,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const lightRef = useRef<THREE.PointLight | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (light: THREE.PointLight) => {
        if (onChange) onChange(light);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (light: THREE.PointLight, delta: number) => {
        if (onUpdate) onUpdate(light, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const light = new THREE.PointLight();
      lightRef.current = light;
      setIsActive(active);

      light.color = new THREE.Color(color);
      light.intensity = intensity;
      light.distance = distance;
      light.decay = decay;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      light.position.copy(pos);
      (light as any).enabled = enabled;

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
      light.distance = distance;
      handleChange(light);
    }, [distance, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.decay = decay;
      handleChange(light);
    }, [decay, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      light.position.copy(pos);
      handleChange(light);
    }, [position, handleChange]);

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

PointLight.displayName = "PointLight";

export default PointLight;
