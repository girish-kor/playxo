// play-kit/src/core/HemisphereLight.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface HemisphereLightProps {
  /** Sky color (string, number, or Color) */
  skyColor?: string | number | THREE.Color;
  /** Ground color (string, number, or Color) */
  groundColor?: string | number | THREE.Color;
  /** Intensity of the light */
  intensity?: number;
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Whether the light is enabled */
  enabled?: boolean;

  /** Called when light properties change */
  onChange?: (light: THREE.HemisphereLight) => void;
  /** Called each frame while active */
  onUpdate?: (light: THREE.HemisphereLight, delta: number) => void;

  /** Whether the light is active (enables onUpdate loop) */
  active?: boolean;
}

export interface HemisphereLightRef {
  /** The underlying Three.js HemisphereLight */
  light: THREE.HemisphereLight | null;
  /** Whether the light is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const HemisphereLight = forwardRef<HemisphereLightRef, HemisphereLightProps>(
  (
    {
      skyColor = 0x87ceeb,
      groundColor = 0x3a3a3a,
      intensity = 0.6,
      position = [0, 0, 0],
      enabled = true,
      onChange,
      onUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const lightRef = useRef<THREE.HemisphereLight | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (light: THREE.HemisphereLight) => {
        if (onChange) onChange(light);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (light: THREE.HemisphereLight, delta: number) => {
        if (onUpdate) onUpdate(light, delta);
      },
      [onUpdate],
    );

    useEffect(() => {
      const light = new THREE.HemisphereLight();
      lightRef.current = light;
      setIsActive(active);

      light.color = new THREE.Color(skyColor);
      light.groundColor = new THREE.Color(groundColor);
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
    }, []);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.color = new THREE.Color(skyColor);
      handleChange(light);
    }, [skyColor, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.groundColor = new THREE.Color(groundColor);
      handleChange(light);
    }, [groundColor, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.intensity = intensity;
      handleChange(light);
    }, [intensity, handleChange]);

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
      light.enabled = enabled;
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

HemisphereLight.displayName = "HemisphereLight";

export default HemisphereLight;
