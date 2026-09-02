// play-kit/src/core/Light.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface LightProps {
  /** Color of the light (string, number, or Color) */
  color?: string | number | THREE.Color;
  /** Intensity of the light */
  intensity?: number;
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Whether the light is enabled */
  enabled?: boolean;

  /** Called when light properties change */
  onChange?: (light: THREE.Light) => void;
  /** Called each frame while active */
  onUpdate?: (light: THREE.Light, delta: number) => void;

  /** Whether the light is active (enables onUpdate loop) */
  active?: boolean;
}

export interface LightRef {
  /** The underlying Three.js Light */
  light: THREE.Light | null;
  /** Whether the light is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const Light = forwardRef<LightRef, LightProps>(
  (
    {
      color = 0xffffff,
      intensity = 1,
      position = [0, 0, 0],
      enabled = true,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const lightRef = useRef<THREE.Light | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (light: THREE.Light) => {
        if (onChange) onChange(light);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (light: THREE.Light, delta: number) => {
        if (onUpdate) onUpdate(light, delta);
      },
      [onUpdate],
    );

    // Create light
    useEffect(() => {
      const light = new THREE.Light();
      lightRef.current = light;
      setIsActive(active);

      // Set initial values
      light.color = new THREE.Color(color);
      light.intensity = intensity;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      light.position.copy(pos);
      light.enabled = enabled;

      handleChange(light);

      return () => {
        lightRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only once

    // Sync color
    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.color = new THREE.Color(color);
      handleChange(light);
    }, [color, handleChange]);

    // Sync intensity
    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.intensity = intensity;
      handleChange(light);
    }, [intensity, handleChange]);

    // Sync position
    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      light.position.copy(pos);
      handleChange(light);
    }, [position, handleChange]);

    // Sync enabled
    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.enabled = enabled;
      handleChange(light);
    }, [enabled, handleChange]);

    // Active state sync
    useEffect(() => {
      setIsActive(active);
    }, [active]);

    // Animation loop for onUpdate
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

Light.displayName = "Light";

export default Light;
