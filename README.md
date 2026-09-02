# 🎮 Play-Kit

A comprehensive, production-ready 3D development library that transforms complex 3D graphics programming into intuitive, composable React components.
Built on top of **React**, **Three.js**, and **@react-three/fiber**, Play-Kit provides a declarative API for building games, visualizations, and interactive 3D experiences with ease.

---

## ✨ Features

- **Declarative 3D Components** – Build scenes, cameras, lights, geometry, materials, animations, physics, particles, and post-processing using React components.
- **Full TypeScript Support** – Complete type definitions for all components, hooks, and utilities.
- **Modular & Tree-shakable** – Import only what you need; zero unused code in your bundles.
- **Production Ready** – Optimized for performance with built-in memoization, lifecycle management, and efficient updates.
- **Rich Ecosystem** – Includes controls (Orbit, FirstPerson, Drag, etc.), effects (Bloom, SSAO, DOF, etc.), loaders, physics, particles, and UI components.

---

## 📦 Installation

```bash
npm install play-kit three @react-three/fiber react
# or
yarn add play-kit three @react-three/fiber react
```

> **Note:** `three`, `@react-three/fiber`, and `react` are peer dependencies and must be installed separately.

---

## 🚀 Quick Start

```tsx
import { Canvas } from "@react-three/fiber";
import {
  Scene,
  Camera,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  OrbitControls,
} from "play-kit";

function App() {
  return (
    <Canvas>
      <Scene background="#1a1a2e">
        <Camera position={[0, 0, 5]} />
        <OrbitControls enableDamping />

        <Mesh position={[0, 0, 0]}>
          <BoxGeometry width={2} height={2} depth={2} />
          <MeshStandardMaterial
            color="#e94560"
            roughness={0.4}
            metalness={0.6}
          />
        </Mesh>
      </Scene>
    </Canvas>
  );
}
```

---

## 📖 Documentation

Full documentation, API reference, and examples are available at [play-kit.dev](https://play-kit.dev) (coming soon).

---

## 🧩 Component Overview

| Category       | Components                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**       | `Scene`, `Camera`, `Group`, `Mesh`, `AmbientLight`, `DirectionalLight`, `PointLight`, `SpotLight`, `HemisphereLight`, `Renderer`, `Skeleton`, `SkinnedMesh`, `InstancedMesh`, `Bone`, `Object3D`                                                                                                                                                                    |
| **Geometry**   | `BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `ConeGeometry`, `PlaneGeometry`, `TorusGeometry`, `TorusKnotGeometry`, `TubeGeometry`, `TextGeometry`, `ExtrudeGeometry`, `LatheGeometry`, `RingGeometry`, `ShapeGeometry`, `CircleGeometry`, `DodecahedronGeometry`, `IcosahedronGeometry`, `OctahedronGeometry`, `TetrahedronGeometry`, `ParametricGeometry` |
| **Materials**  | `MeshStandardMaterial`, `MeshPhysicalMaterial`, `MeshPhongMaterial`, `MeshLambertMaterial`, `MeshToonMaterial`, `MeshMatcapMaterial`, `MeshNormalMaterial`, `MeshDepthMaterial`, `MeshBasicMaterial`, `PointsMaterial`, `SpriteMaterial`, `ShadowMaterial`, `LineBasicMaterial`, `LineDashedMaterial`, `ShaderMaterial`, `RawShaderMaterial`                        |
| **Animations** | `AnimationMixer`, `AnimationClip`, `AnimationAction`, `AnimationStateMachine`, `AnimationTransition`, `KeyframeTrack`, `BooleanKeyframeTrack`, `NumberKeyframeTrack`, `QuaternionKeyframeTrack`, `StringKeyframeTrack`, `VectorKeyframeTrack`, `AnimationBlender`                                                                                                   |
| **Controls**   | `OrbitControls`, `ArcballControls`, `FirstPersonControls`, `FlyControls`, `DragControls`, `TransformControls`, `DeviceOrientationControls`, `ThirdPersonControls`, `SmoothDampingControls`, `KeyboardControls`, `MouseControls`, `TouchControls`, `GamepadControls`, `VRControls`, `XRControls`                                                                     |
| **Effects**    | `EffectComposer`, `RenderPass`, `UnrealBloomPass`, `SSAOPass`, `SSRPass`, `OutlinePass`, `DepthOfFieldPass`, `FXAAPass`, `SMAAPass`, `TAAPass`, `GlitchPass`, `RGBShiftPass`, `DotScreenPass`, `HalftonePass`, `BokehPass`, `BlurPass`, `WaterPass`, `ReflectorPass`, `RefractorPass`, `FogPass`, `ShaderPass`, `CustomShaderPass`                                  |
| **Loaders**    | `GLTFLoader`, `FBXLoader`, `OBJLoader`, `MTLLoader`, `DRACOLoader`, `KTX2Loader`, `TextureLoader`, `CubeTextureLoader`, `HDRCubeTextureLoader`, `FontLoader`, `AudioLoader`, `ImageBitmapLoader`, `LottieLoader`, `BVHLoader`, `MMDLoader`, `TGALoader`, `VideoTextureLoader`                                                                                       |
| **Particles**  | `ParticleSystem`, `CPUParticles`, `GPUParticles`, `Points`, `SpriteParticles`, `ParticleEmitter`, `ParticleBurst`, `ParticleTrail`, `ParticleAttractor`, `ParticlePhysics`, `ParticleNoise`                                                                                                                                                                         |
| **Physics**    | `PhysicsWorld`, `RigidBody`, `StaticBody`, `KinematicBody`, `BoxCollider`, `SphereCollider`, `CapsuleCollider`, `MeshCollider`, `ConvexHullCollider`, `HeightfieldCollider`, `Constraint`, `BallConstraint`, `HingeConstraint`, `SliderConstraint`, `VehicleBody`, `Ragdoll`                                                                                        |
| **UI**         | `HealthBar`, `StaminaBar`, `AmmoCounter`, `Crosshair`, `MiniMap`                                                                                                                                                                                                                                                                                                    |
| **Hooks**      | `useComponentLifecycle`, `useParticle`, `useUI`                                                                                                                                                                                                                                                                                                                     |

---

## 🛠️ Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

---

## 📄 License

MIT © 2025 Girish Kor. See [LICENSE](LICENSE) for details.
