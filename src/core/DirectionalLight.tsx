// play-kit/src/core/DirectionalLight.tsx

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from "react";
import * as THREE from "three";

export interface DirectionalLightProps {
  /** Color of the light (string, number, or Color) */
  color?: string | number | THREE.Color;
  /** Intensity of the light */
  intensity?: number;
  /** Position as [x, y, z] or Vector3 */
  position?: [number, number, number] | THREE.Vector3;
  /** Target to look at as [x, y, z] or Vector3 */
  target?: [number, number, number] | THREE.Vector3;
  /** Whether the light casts shadows */
  castShadow?: boolean;
  /** Shadow map size (width, height) */
  shadowMapSize?: [number, number];
  /** Whether the light is enabled */
  enabled?: boolean;

  /** Called when light properties change */
  onChange?: (light: THREE.DirectionalLight) => void;
  /** Called each frame while active */
  onUpdate?: (light: THREE.DirectionalLight, delta: number) => void;
  /** Called when shadow map updates */
  onShadowUpdate?: (light: THREE.DirectionalLight) => void;

  /** Whether the light is active (enables onUpdate loop) */
  active?: boolean;
}

export interface DirectionalLightRef {
  /** The underlying Three.js DirectionalLight */
  light: THREE.DirectionalLight | null;
  /** Whether the light is active */
  active: boolean;
  /** Manually set active state */
  setActive: (active: boolean) => void;
  /** Force an update event */
  update: () => void;
}

const DirectionalLight = forwardRef<DirectionalLightRef, DirectionalLightProps>(
  (
    {
      color = 0xffffff,
      intensity = 1,
      position = [10, 10, 10],
      target = [0, 0, 0],
      castShadow = false,
      shadowMapSize = [1024, 1024],
      enabled = true,
      onChange,
      onUpdate,
      onShadowUpdate,
      active = true,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState<boolean>(active);

    const lightRef = useRef<THREE.DirectionalLight | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(performance.now());

    const handleChange = useCallback(
      (light: THREE.DirectionalLight) => {
        if (onChange) onChange(light);
      },
      [onChange],
    );

    const handleUpdate = useCallback(
      (light: THREE.DirectionalLight, delta: number) => {
        if (onUpdate) onUpdate(light, delta);
      },
      [onUpdate],
    );

    const handleShadowUpdate = useCallback(
      (light: THREE.DirectionalLight) => {
        if (onShadowUpdate) onShadowUpdate(light);
      },
      [onShadowUpdate],
    );

    useEffect(() => {
      const light = new THREE.DirectionalLight();
      lightRef.current = light;
      setIsActive(active);

      light.color = new THREE.Color(color);
      light.intensity = intensity;
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      light.position.copy(pos);
      const tgt = Array.isArray(target) ? new THREE.Vector3(...target) : target;
      light.target.position.copy(tgt);
      light.castShadow = castShadow;
      light.shadow.mapSize.width = shadowMapSize[0];
      light.shadow.mapSize.height = shadowMapSize[1];
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
      const pos = Array.isArray(position)
        ? new THREE.Vector3(...position)
        : position;
      light.position.copy(pos);
      handleChange(light);
    }, [position, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      const tgt = Array.isArray(target) ? new THREE.Vector3(...target) : target;
      light.target.position.copy(tgt);
      handleChange(light);
    }, [target, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.castShadow = castShadow;
      handleChange(light);
    }, [castShadow, handleChange]);

    useEffect(() => {
      const light = lightRef.current;
      if (!light) return;
      light.shadow.mapSize.width = shadowMapSize[0];
      light.shadow.mapSize.height = shadowMapSize[1];
      if (castShadow) {
        // Rebuild shadow map
        light.shadow.needsUpdate = true;
        handleShadowUpdate(light);
      }
      handleChange(light);
    }, [shadowMapSize, castShadow, handleChange, handleShadowUpdate]);

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

DirectionalLight.displayName = "DirectionalLight";

export default DirectionalLight;
