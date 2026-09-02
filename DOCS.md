# playxo

**_playxo is a comprehensive, production-ready 3D development library that transforms complex 3D graphics programming into intuitive, composable React components. It serves as a bridge between declarative UI development and imperative 3D rendering, making professional-grade game development accessible to web developers._**

## Core Components

### Scene

- **Path:** `src/core/Scene.tsx`
- **Purpose:** Root container for all 3D objects; manages scene graph, fog, and background.
- **API:** `background` (color/texture), `fog` (Fog/FogExp2), `autoUpdate` (bool), `children` (ReactNode)
- **Events:** `onReady`, `onUpdate`, `onBeforeRender`, `onAfterRender`
- **States:** `loading`, `ready`, `rendering`
- **Slots:** Any 3D object, light, camera, helper
- **Dependencies:** Three.js `Scene`
- **Usage:** `<Scene background={0x000000}><Camera /><Mesh /></Scene>`

### Camera

- **Path:** `src/core/Camera.tsx`
- **Purpose:** Defines viewport perspective; supports perspective and orthographic.
- **API:** `fov` (number), `aspect` (number), `near` (number), `far` (number), `position` (Vector3), `lookAt` (Vector3), `orthographic` (bool)
- **Events:** `onChange`, `onUpdate`
- **Variants:** `PerspectiveCamera`, `OrthographicCamera`, `ArrayCamera`
- **States:** `active`, `idle`
- **Dependencies:** Three.js `Camera`
- **Usage:** `<Camera position={[0,0,5]} fov={75} />`

### Renderer

- **Path:** `src/core/Renderer.tsx`
- **Purpose:** Renders scene to canvas; manages WebGL context and output.
- **API:** `antialias` (bool), `shadows` (bool), `pixelRatio` (number), `size` (object), `toneMapping` (enum)
- **Events:** `onResize`, `onRender`, `onContextLost`
- **Variants:** `WebGLRenderer`, `WebGPURenderer`
- **States:** `rendering`, `resizing`
- **Slots:** `<Scene>` as child
- **Styling:** Canvas via `style` prop
- **Accessibility:** `aria-label="3D Renderer"`
- **Dependencies:** Three.js `WebGLRenderer`
- **Usage:** `<Renderer antialias shadows><Scene /></Renderer>`

### Light

- **Path:** `src/core/Light.tsx`
- **Purpose:** Base light component; abstract class.
- **API:** `color` (string/number), `intensity` (number), `position` (Vector3)
- **Events:** `onChange`
- **States:** `on`, `off`
- **Dependencies:** Three.js `Light`

### AmbientLight

- **Path:** `src/core/AmbientLight.tsx`
- **Purpose:** Soft, omnidirectional illumination.
- **API:** `color` (string/number), `intensity` (number)
- **Events:** `onChange`
- **States:** `on`, `off`
- **Dependencies:** Three.js `AmbientLight`
- **Usage:** `<AmbientLight color={0xffffff} intensity={0.5} />`

### DirectionalLight

- **Path:** `src/core/DirectionalLight.tsx`
- **Purpose:** Parallel rays casting shadows.
- **API:** `color`, `intensity`, `position`, `target`, `castShadow`, `shadowMapSize`
- **Events:** `onChange`, `onShadowUpdate`
- **States:** `on`, `off`, `shadowRendering`
- **Slots:** `<Camera>` for shadow camera
- **Dependencies:** Three.js `DirectionalLight`
- **Usage:** `<DirectionalLight position={[10,10,10]} castShadow />`

### PointLight

- **Path:** `src/core/PointLight.tsx`
- **Purpose:** Omnidirectional light with distance falloff.
- **API:** `color`, `intensity`, `distance` (number), `decay` (number), `position`
- **Events:** `onChange`
- **States:** `on`, `off`
- **Dependencies:** Three.js `PointLight`
- **Usage:** `<PointLight color={0xff0000} intensity={2} distance={10} />`

### SpotLight

- **Path:** `src/core/SpotLight.tsx`
- **Purpose:** Cone-shaped light with direction and angle.
- **API:** `color`, `intensity`, `distance`, `angle` (number), `penumbra` (number), `decay`, `position`, `target`
- **Events:** `onChange`
- **States:** `on`, `off`
- **Slots:** `<Camera>` for shadow camera
- **Dependencies:** Three.js `SpotLight`
- **Usage:** `<SpotLight angle={0.3} penumbra={0.2} position={[0,5,0]} />`

### HemisphereLight

- **Path:** `src/core/HemisphereLight.tsx`
- **Purpose:** Sky and ground color illumination.
- **API:** `skyColor` (string/number), `groundColor` (string/number), `intensity` (number), `position`
- **Events:** `onChange`
- **States:** `on`, `off`
- **Dependencies:** Three.js `HemisphereLight`
- **Usage:** `<HemisphereLight skyColor={0x87ceeb} groundColor={0x3a3a3a} intensity={0.6} />`

### Group

- **Path:** `src/core/Group.tsx`
- **Purpose:** Container for grouping objects; transforms applied collectively.
- **API:** `position` (Vector3), `rotation` (Euler), `scale` (Vector3), `children` (ReactNode)
- **Events:** `onUpdate`
- **States:** `active`, `idle`
- **Slots:** Any 3D object
- **Dependencies:** Three.js `Group`
- **Usage:** `<Group position={[1,2,3]}><Mesh /><Mesh /></Group>`

### Object3D

- **Path:** `src/core/Object3D.tsx`
- **Purpose:** Base class for all 3D objects.
- **API:** `position`, `rotation`, `scale`, `quaternion`, `visible` (bool)
- **Events:** `onUpdate`, `onChange`
- **States:** `visible`, `hidden`
- **Dependencies:** Three.js `Object3D`

### Mesh

- **Path:** `src/core/Mesh.tsx`
- **Purpose:** Geometry + Material renderable object.
- **API:** `geometry`, `material`, `position`, `rotation`, `scale`, `castShadow` (bool), `receiveShadow` (bool)
- **Events:** `onClick`, `onHover`, `onUpdate`
- **Variants:** `Mesh`, `InstancedMesh`, `SkinnedMesh`
- **States:** `hovered`, `selected`, `active`
- **Accessibility:** `aria-label` for object description
- **Dependencies:** Three.js `Mesh`
- **Usage:** `<Mesh geometry={boxGeometry} material={standardMaterial} castShadow />`

### InstancedMesh

- **Path:** `src/core/InstancedMesh.tsx`
- **Purpose:** Efficient rendering of many identical geometries.
- **API:** `geometry`, `material`, `count` (number), `instanceMatrix`, `instanceColor`
- **Events:** `onUpdate`
- **States:** `active`, `idle`
- **Dependencies:** Three.js `InstancedMesh`
- **Usage:** `<InstancedMesh geometry={boxGeometry} count={100} />`

### SkinnedMesh

- **Path:** `src/core/SkinnedMesh.tsx`
- **Purpose:** Mesh with skeletal animation support.
- **API:** `geometry`, `material`, `skeleton`, `bindMode`
- **Events:** `onUpdate`, `onAnimationFrame`
- **States:** `animating`, `idle`
- **Slots:** `<Bone>` components
- **Dependencies:** Three.js `SkinnedMesh`
- **Usage:** `<SkinnedMesh geometry={mesh} skeleton={skeleton} />`

### Bone

- **Path:** `src/core/Bone.tsx`
- **Purpose:** Skeletal bone for rigging and animation.
- **API:** `name` (string), `position`, `rotation`, `scale`
- **Events:** `onUpdate`
- **States:** `active`, `idle`
- **Slots:** `<Bone>` children for hierarchy
- **Dependencies:** Three.js `Bone`
- **Usage:** `<Bone name="arm" position={[0,1,0]} />`

### Skeleton

- **Path:** `src/core/Skeleton.tsx`
- **Purpose:** Container for bone hierarchy and inverse kinematics.
- **API:** `bones` (array), `boneInverses`, `name`
- **Events:** `onUpdate`
- **States:** `ready`, `animating`
- **Slots:** `<Bone>` components
- **Dependencies:** Three.js `Skeleton`
- **Usage:** `<Skeleton bones={boneArray} />`

---

## Geometries

### BoxGeometry

- **Path:** `src/geometries/BoxGeometry.tsx`
- **Purpose:** Rectangular box/cuboid.
- **API:** `width` (number), `height` (number), `depth` (number), `widthSegments` (number), `heightSegments` (number), `depthSegments` (number)
- **Usage:** `<BoxGeometry width={2} height={1} depth={3} />`

### SphereGeometry

- **Path:** `src/geometries/SphereGeometry.tsx`
- **Purpose:** Sphere.
- **API:** `radius` (number), `widthSegments` (number), `heightSegments` (number), `phiStart`, `phiLength`, `thetaStart`, `thetaLength`
- **Usage:** `<SphereGeometry radius={1.5} widthSegments={32} heightSegments={32} />`

### CylinderGeometry

- **Path:** `src/geometries/CylinderGeometry.tsx`
- **Purpose:** Cylinder.
- **API:** `radiusTop` (number), `radiusBottom` (number), `height` (number), `radialSegments` (number), `heightSegments` (number), `openEnded` (bool)
- **Usage:** `<CylinderGeometry radiusTop={1} radiusBottom={1} height={2} />`

### ConeGeometry

- **Path:** `src/geometries/ConeGeometry.tsx`
- **Purpose:** Cone.
- **API:** `radius` (number), `height` (number), `radialSegments` (number), `heightSegments` (number), `openEnded` (bool)
- **Usage:** `<ConeGeometry radius={1} height={2} radialSegments={32} />`

### TorusGeometry

- **Path:** `src/geometries/TorusGeometry.tsx`
- **Purpose:** Torus/donut.
- **API:** `radius` (number), `tube` (number), `radialSegments` (number), `tubularSegments` (number)
- **Usage:** `<TorusGeometry radius={2} tube={0.5} />`

### TorusKnotGeometry

- **Path:** `src/geometries/TorusKnotGeometry.tsx`
- **Purpose:** Torus knot.
- **API:** `radius` (number), `tube` (number), `tubularSegments` (number), `radialSegments` (number), `p` (number), `q` (number)
- **Usage:** `<TorusKnotGeometry radius={2} tube={0.5} p={3} q={7} />`

### PlaneGeometry

- **Path:** `src/geometries/PlaneGeometry.tsx`
- **Purpose:** Flat plane.
- **API:** `width` (number), `height` (number), `widthSegments` (number), `heightSegments` (number)
- **Usage:** `<PlaneGeometry width={5} height={5} />`

### CircleGeometry

- **Path:** `src/geometries/CircleGeometry.tsx`
- **Purpose:** Circle.
- **API:** `radius` (number), `segments` (number), `thetaStart`, `thetaLength`
- **Usage:** `<CircleGeometry radius={2} segments={64} />`

### RingGeometry

- **Path:** `src/geometries/RingGeometry.tsx`
- **Purpose:** Ring.
- **API:** `innerRadius` (number), `outerRadius` (number), `thetaSegments` (number), `phiSegments` (number)
- **Usage:** `<RingGeometry innerRadius={1} outerRadius={2} />`

### IcosahedronGeometry

- **Path:** `src/geometries/IcosahedronGeometry.tsx`
- **Purpose:** Icosahedron.
- **API:** `radius` (number), `detail` (number)
- **Usage:** `<IcosahedronGeometry radius={1} detail={1} />`

### OctahedronGeometry

- **Path:** `src/geometries/OctahedronGeometry.tsx`
- **Purpose:** Octahedron.
- **API:** `radius` (number), `detail` (number)
- **Usage:** `<OctahedronGeometry radius={1} detail={1} />`

### TetrahedronGeometry

- **Path:** `src/geometries/TetrahedronGeometry.tsx`
- **Purpose:** Tetrahedron.
- **API:** `radius` (number), `detail` (number)
- **Usage:** `<TetrahedronGeometry radius={1} detail={1} />`

### DodecahedronGeometry

- **Path:** `src/geometries/DodecahedronGeometry.tsx`
- **Purpose:** Dodecahedron.
- **API:** `radius` (number), `detail` (number)
- **Usage:** `<DodecahedronGeometry radius={1} detail={1} />`

### ExtrudeGeometry

- **Path:** `src/geometries/ExtrudeGeometry.tsx`
- **Purpose:** Extrudes a 2D shape.
- **API:** `shape` (Shape), `options` (object: depth, bevelEnabled, bevelThickness, etc.)
- **Usage:** `<ExtrudeGeometry shape={shape} options={{depth:2}} />`

### LatheGeometry

- **Path:** `src/geometries/LatheGeometry.tsx`
- **Purpose:** Revolves points around an axis.
- **API:** `points` (array), `segments` (number), `phiStart`, `phiLength`
- **Usage:** `<LatheGeometry points={pointsArray} segments={32} />`

### ShapeGeometry

- **Path:** `src/geometries/ShapeGeometry.tsx`
- **Purpose:** Geometry from 2D shape.
- **API:** `shape` (Shape), `curveSegments` (number)
- **Usage:** `<ShapeGeometry shape={shape} curveSegments={12} />`

### TubeGeometry

- **Path:** `src/geometries/TubeGeometry.tsx`
- **Purpose:** Tube along a 3D curve.
- **API:** `path` (Curve), `tubularSegments` (number), `radius` (number), `radialSegments` (number), `closed` (bool)
- **Usage:** `<TubeGeometry path={curve} radius={0.5} tubularSegments={64} />`

### ParametricGeometry

- **Path:** `src/geometries/ParametricGeometry.tsx`
- **Purpose:** Parametric surface.
- **API:** `func` (function), `slices` (number), `stacks` (number)
- **Usage:** `<ParametricGeometry func={parametricFunction} slices={32} stacks={32} />`

### TextGeometry

- **Path:** `src/geometries/TextGeometry.tsx`
- **Purpose:** 3D text from font.
- **API:** `text` (string), `font` (Font), `size` (number), `height` (number), `curveSegments` (number), `bevelEnabled` (bool)
- **States:** `loading`, `ready`
- **Dependencies:** Three.js `TextGeometry`
- **Usage:** `<TextGeometry text="Hello" font={font} size={2} height={0.5} />`

---

## Materials

### MeshStandardMaterial

- **Path:** `src/materials/MeshStandardMaterial.tsx`
- **Purpose:** PBR with roughness/metalness.
- **API:** `color`, `roughness` (number), `metalness` (number), `map`, `normalMap`, `roughnessMap`, `metalnessMap`, `envMap`, `emissive`
- **Usage:** `<MeshStandardMaterial color="blue" roughness={0.5} metalness={0.5} />`

### MeshPhysicalMaterial

- **Path:** `src/materials/MeshPhysicalMaterial.tsx`
- **Purpose:** Advanced PBR with clearcoat, sheen, transmission.
- **API:** `color`, `roughness`, `metalness`, `clearcoat` (number), `clearcoatRoughness`, `sheen`, `sheenRoughness`, `transmission`, `thickness`, `ior`
- **Usage:** `<MeshPhysicalMaterial color="red" clearcoat={0.5} transmission={0.5} />`

### MeshPhongMaterial

- **Path:** `src/materials/MeshPhongMaterial.tsx`
- **Purpose:** Phong shading with specular highlights.
- **API:** `color`, `specular`, `shininess` (number), `map`, `normalMap`, `emissive`
- **Usage:** `<MeshPhongMaterial color="green" shininess={100} />`

### MeshLambertMaterial

- **Path:** `src/materials/MeshLambertMaterial.tsx`
- **Purpose:** Lambertian shading (diffuse only).
- **API:** `color`, `map`, `normalMap`, `emissive`
- **Usage:** `<MeshLambertMaterial color="orange" />`

### MeshToonMaterial

- **Path:** `src/materials/MeshToonMaterial.tsx`
- **Purpose:** Cartoon toon shading.
- **API:** `color`, `gradientMap`, `map`, `normalMap`, `emissive`
- **Usage:** `<MeshToonMaterial color="yellow" gradientMap={gradientTexture} />`

### MeshMatcapMaterial

- **Path:** `src/materials/MeshMatcapMaterial.tsx`
- **Purpose:** Matcap (sphere environment) shading.
- **API:** `color`, `matcap`, `map`, `normalMap`
- **Usage:** `<MeshMatcapMaterial matcap={matcapTexture} />`

### MeshDepthMaterial

- **Path:** `src/materials/MeshDepthMaterial.tsx`
- **Purpose:** Renders depth values.
- **API:** `depthPacking`, `map`
- **Usage:** `<MeshDepthMaterial />`

### MeshNormalMaterial

- **Path:** `src/materials/MeshNormalMaterial.tsx`
- **Purpose:** Renders normal vectors as colors.
- **API:** `flatShading` (bool)
- **Usage:** `<MeshNormalMaterial flatShading />`

### MeshBasicMaterial

- **Path:** `src/materials/MeshBasicMaterial.tsx`
- **Purpose:** Simple material unaffected by lighting.
- **API:** `color`, `map`, `wireframe` (bool)
- **Usage:** `<MeshBasicMaterial color="purple" wireframe />`

### ShaderMaterial

- **Path:** `src/materials/ShaderMaterial.tsx`
- **Purpose:** Custom vertex/fragment shaders.
- **API:** `vertexShader` (string), `fragmentShader` (string), `uniforms` (object), `transparent` (bool)
- **Events:** `onChange`, `onCompile`
- **States:** `compiling`, `ready`
- **Dependencies:** Three.js `ShaderMaterial`
- **Usage:** `<ShaderMaterial vertexShader={vs} fragmentShader={fs} uniforms={uniforms} />`

### RawShaderMaterial

- **Path:** `src/materials/RawShaderMaterial.tsx`
- **Purpose:** Shader material without built-in uniforms/attributes.
- **API:** `vertexShader`, `fragmentShader`, `uniforms`
- **Events:** `onChange`, `onCompile`
- **States:** `compiling`, `ready`
- **Dependencies:** Three.js `RawShaderMaterial`
- **Usage:** `<RawShaderMaterial vertexShader={vs} fragmentShader={fs} uniforms={uniforms} />`

### ShadowMaterial

- **Path:** `src/materials/ShadowMaterial.tsx`
- **Purpose:** Renders shadows only.
- **API:** `color`, `opacity` (number)
- **Usage:** `<ShadowMaterial color="black" opacity={0.5} />`

### PointsMaterial

- **Path:** `src/materials/PointsMaterial.tsx`
- **Purpose:** Material for points/particles.
- **API:** `color`, `size` (number), `map`, `sizeAttenuation` (bool), `opacity`
- **Events:** `onChange`
- **States:** `ready`
- **Dependencies:** Three.js `PointsMaterial`
- **Usage:** `<PointsMaterial color="white" size={0.1} sizeAttenuation />`

### LineBasicMaterial

- **Path:** `src/materials/LineBasicMaterial.tsx`
- **Purpose:** Line rendering.
- **API:** `color`, `linewidth` (number), `opacity`
- **Usage:** `<LineBasicMaterial color="red" />`

### LineDashedMaterial

- **Path:** `src/materials/LineDashedMaterial.tsx`
- **Purpose:** Dashed lines.
- **API:** `color`, `dashSize` (number), `gapSize` (number), `scale`
- **Usage:** `<LineDashedMaterial color="blue" dashSize={0.2} gapSize={0.1} />`

### SpriteMaterial

- **Path:** `src/materials/SpriteMaterial.tsx`
- **Purpose:** Sprite (always facing camera).
- **API:** `color`, `map`, `opacity`, `rotation`
- **Usage:** `<SpriteMaterial map={texture} color="white" />`

---

## Loaders

### GLTFLoader

- **Path:** `src/loaders/GLTFLoader.tsx`
- **Purpose:** Load glTF/glb models.
- **API:** `src` (string), `onLoad` (func), `onProgress` (func), `onError` (func), `draco` (bool), `ktx2` (bool)
- **Events:** `onLoad`, `onProgress`, `onError`, `onComplete`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `GLTFLoader`, `DRACOLoader`, `KTX2Loader`
- **Usage:** `<GLTFLoader src="/model.glb" onLoad={handleLoad} />`

### FBXLoader

- **Path:** `src/loaders/FBXLoader.tsx`
- **Purpose:** Load FBX models.
- **API:** `src`, `onLoad`, `onProgress`, `onError`
- **Events:** `onLoad`, `onProgress`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `FBXLoader`
- **Usage:** `<FBXLoader src="/model.fbx" onLoad={handleLoad} />`

### OBJLoader

- **Path:** `src/loaders/OBJLoader.tsx`
- **Purpose:** Load OBJ models.
- **API:** `src`, `onLoad`, `onProgress`, `onError`
- **Events:** `onLoad`, `onProgress`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `OBJLoader`
- **Usage:** `<OBJLoader src="/model.obj" onLoad={handleLoad} />`

### MTLLoader

- **Path:** `src/loaders/MTLLoader.tsx`
- **Purpose:** Load MTL materials for OBJ.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `MTLLoader`
- **Usage:** `<MTLLoader src="/material.mtl" onLoad={handleLoad} />`

### DRACOLoader

- **Path:** `src/loaders/DRACOLoader.tsx`
- **Purpose:** Load Draco-compressed geometry.
- **API:** `src`, `onLoad`, `onError`, `decoderPath` (string)
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `DRACOLoader`
- **Usage:** `<DRACOLoader src="/geometry.drc" decoderPath="/draco/" />`

### KTX2Loader

- **Path:** `src/loaders/KTX2Loader.tsx`
- **Purpose:** Load KTX2 compressed textures.
- **API:** `src`, `onLoad`, `onError`, `transcoderPath` (string)
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `KTX2Loader`
- **Usage:** `<KTX2Loader src="/texture.ktx2" onLoad={handleLoad} />`

### TextureLoader

- **Path:** `src/loaders/TextureLoader.tsx`
- **Purpose:** Load standard image textures.
- **API:** `src`, `onLoad`, `onError`, `crossOrigin` (string)
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `TextureLoader`
- **Usage:** `<TextureLoader src="/texture.jpg" onLoad={setTexture} />`

### CubeTextureLoader

- **Path:** `src/loaders/CubeTextureLoader.tsx`
- **Purpose:** Load cube map textures.
- **API:** `urls` (array), `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `CubeTextureLoader`
- **Usage:** `<CubeTextureLoader urls={['px.jpg','nx.jpg',...]} onLoad={setCubeMap} />`

### VideoTextureLoader

- **Path:** `src/loaders/VideoTextureLoader.tsx`
- **Purpose:** Load video textures.
- **API:** `src`, `onLoad`, `onError`, `autoplay` (bool), `loop` (bool)
- **Events:** `onLoad`, `onError`, `onPlay`, `onPause`
- **States:** `loading`, `loaded`, `playing`, `paused`
- **Dependencies:** `VideoTexture`
- **Usage:** `<VideoTextureLoader src="/video.mp4" autoplay loop />`

### AudioLoader

- **Path:** `src/loaders/AudioLoader.tsx`
- **Purpose:** Load audio files.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `AudioLoader`
- **Usage:** `<AudioLoader src="/sound.mp3" onLoad={setAudioBuffer} />`

### FontLoader

- **Path:** `src/loaders/FontLoader.tsx`
- **Purpose:** Load font files for TextGeometry.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `FontLoader`
- **Usage:** `<FontLoader src="/font.json" onLoad={setFont} />`

### BVHLoader

- **Path:** `src/loaders/BVHLoader.tsx`
- **Purpose:** Load BVH motion capture.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `BVHLoader`
- **Usage:** `<BVHLoader src="/animation.bvh" onLoad={setAnimation} />`

### MMDLoader

- **Path:** `src/loaders/MMDLoader.tsx`
- **Purpose:** Load MMD (MikuMikuDance) models.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `MMDLoader`
- **Usage:** `<MMDLoader src="/model.pmx" onLoad={handleLoad} />`

### TGALoader

- **Path:** `src/loaders/TGALoader.tsx`
- **Purpose:** Load TGA images.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `TGALoader`
- **Usage:** `<TGALoader src="/texture.tga" onLoad={setTexture} />`

### HDRCubeTextureLoader

- **Path:** `src/loaders/HDRCubeTextureLoader.tsx`
- **Purpose:** Load HDR environment maps.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `HDRCubeTextureLoader`
- **Usage:** `<HDRCubeTextureLoader src="/environment.hdr" onLoad={setEnvMap} />`

### LottieLoader

- **Path:** `src/loaders/LottieLoader.tsx`
- **Purpose:** Load Lottie animations.
- **API:** `src`, `onLoad`, `onError`, `autoplay` (bool), `loop` (bool)
- **Events:** `onLoad`, `onError`, `onComplete`
- **States:** `loading`, `loaded`, `playing`, `paused`
- **Dependencies:** `LottieLoader`
- **Usage:** `<LottieLoader src="/animation.json" autoplay loop />`

### ImageBitmapLoader

- **Path:** `src/loaders/ImageBitmapLoader.tsx`
- **Purpose:** Load images as ImageBitmap.
- **API:** `src`, `onLoad`, `onError`
- **Events:** `onLoad`, `onError`
- **States:** `loading`, `loaded`, `error`
- **Dependencies:** `ImageBitmapLoader`
- **Usage:** `<ImageBitmapLoader src="/large-image.jpg" onLoad={setImageBitmap} />`

---

## Animations

### AnimationMixer

- **Path:** `src/animations/AnimationMixer.tsx`
- **Purpose:** Manages animations on a target.
- **API:** `target` (Object3D), `children` (ReactNode), `timeScale` (number)
- **Events:** `onUpdate`, `onLoop`, `onFinished`
- **States:** `playing`, `paused`, `stopped`
- **Slots:** `<AnimationAction>` components
- **Dependencies:** Three.js `AnimationMixer`
- **Usage:** `<AnimationMixer target={mesh}><AnimationAction clip={clip} /></AnimationMixer>`

### AnimationClip

- **Path:** `src/animations/AnimationClip.tsx`
- **Purpose:** Defines reusable animation clip.
- **API:** `name` (string), `duration` (number), `tracks` (array), `blendMode`
- **Events:** `onLoad`, `onReady`
- **States:** `ready`, `loading`
- **Slots:** `<KeyframeTrack>` components
- **Dependencies:** Three.js `AnimationClip`
- **Usage:** `<AnimationClip name="walk" duration={1}><KeyframeTrack ... /></AnimationClip>`

### AnimationAction

- **Path:** `src/animations/AnimationAction.tsx`
- **Purpose:** Controls playback of animation clip.
- **API:** `clip` (AnimationClip), `loop` (bool), `timeScale` (number), `weight` (number), `fadeIn` (number), `fadeOut` (number)
- **Events:** `onStart`, `onLoop`, `onFinish`, `onUpdate`
- **States:** `playing`, `paused`, `stopped`
- **Dependencies:** Three.js `AnimationAction`
- **Usage:** `<AnimationAction clip={walkClip} loop weight={1} />`

### KeyframeTrack

- **Path:** `src/animations/KeyframeTrack.tsx`
- **Purpose:** Base keyframe track.
- **API:** `name` (string), `times` (array), `values` (array), `interpolation`
- **Usage:** `<KeyframeTrack name="position" times={[0,1]} values={[0,0,0,1,1,1]} />`

### BooleanKeyframeTrack

- **Path:** `src/animations/BooleanKeyframeTrack.tsx`
- **Purpose:** Boolean-valued track.
- **API:** `name`, `times`, `values`
- **Dependencies:** Three.js `BooleanKeyframeTrack`
- **Usage:** `<BooleanKeyframeTrack name="visible" times={[0,1]} values={[true,false]} />`

### NumberKeyframeTrack

- **Path:** `src/animations/NumberKeyframeTrack.tsx`
- **Purpose:** Number-valued track.
- **API:** `name`, `times`, `values`
- **Dependencies:** Three.js `NumberKeyframeTrack`
- **Usage:** `<NumberKeyframeTrack name="scale.x" times={[0,1]} values={[1,2]} />`

### QuaternionKeyframeTrack

- **Path:** `src/animations/QuaternionKeyframeTrack.tsx`
- **Purpose:** Quaternion-valued track for rotations.
- **API:** `name`, `times`, `values`
- **Dependencies:** Three.js `QuaternionKeyframeTrack`
- **Usage:** `<QuaternionKeyframeTrack name="rotation" times={[0,1]} values={[0,0,0,1,0,0,0,1]} />`

### StringKeyframeTrack

- **Path:** `src/animations/StringKeyframeTrack.tsx`
- **Purpose:** String-valued track.
- **API:** `name`, `times`, `values`
- **Dependencies:** Three.js `StringKeyframeTrack`
- **Usage:** `<StringKeyframeTrack name="morph" times={[0,1]} values={["idle","walk"]} />`

### VectorKeyframeTrack

- **Path:** `src/animations/VectorKeyframeTrack.tsx`
- **Purpose:** Vector-valued track.
- **API:** `name`, `times`, `values`
- **Dependencies:** Three.js `VectorKeyframeTrack`
- **Usage:** `<VectorKeyframeTrack name="position" times={[0,1]} values={[0,0,0,1,1,1]} />`

### AnimationBlender

- **Path:** `src/animations/AnimationBlender.tsx`
- **Purpose:** Blends multiple animations.
- **API:** `actions` (array), `weights` (array), `mode`
- **Events:** `onUpdate`, `onBlend`
- **States:** `blending`, `idle`
- **Slots:** `<AnimationAction>` components
- **Usage:** `<AnimationBlender actions={[walk,run]} weights={[0.5,0.5]} />`

### AnimationTransition

- **Path:** `src/animations/AnimationTransition.tsx`
- **Purpose:** Defines animation state transitions.
- **API:** `from` (string), `to` (string), `duration` (number), `condition` (func)
- **Events:** `onStart`, `onComplete`
- **States:** `idle`, `transitioning`
- **Usage:** `<AnimationTransition from="idle" to="walk" duration={0.3} condition={isMoving} />`

### AnimationStateMachine

- **Path:** `src/animations/AnimationStateMachine.tsx`
- **Purpose:** Manages animation states and transitions.
- **API:** `initialState` (string), `states` (object), `transitions` (array)
- **Events:** `onStateEnter`, `onStateExit`, `onTransition`
- **Slots:** `<AnimationState>` components
- **Usage:** `<AnimationStateMachine initialState="idle"><AnimationState name="idle" ... /></AnimationStateMachine>`

---

## Physics

### PhysicsWorld

- **Path:** `src/physics/PhysicsWorld.tsx`
- **Purpose:** Root physics simulation container.
- **API:** `gravity` (Vector3), `solverIterations` (number), `maxSubSteps` (number), `fixedTimeStep` (number)
- **Events:** `onStep`, `onCollision`, `onUpdate`
- **States:** `running`, `paused`, `stepping`
- **Slots:** Physics bodies and colliders
- **Dependencies:** `@react-three/rapier` or `ammo.js`
- **Usage:** `<PhysicsWorld gravity={[0,-9.81,0]}><RigidBody ... /></PhysicsWorld>`

### RigidBody

- **Path:** `src/physics/RigidBody.tsx`
- **Purpose:** Dynamic physics body with mass/inertia.
- **API:** `mass` (number), `damping` (number), `angularDamping` (number), `lockRotations` (bool), `lockTranslations` (bool), `collider`
- **Events:** `onCollision`, `onWake`, `onSleep`, `onUpdate`
- **States:** `active`, `sleeping`, `kinematic`
- **Slots:** `<Collider>` components
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<RigidBody mass={1}><BoxCollider /></RigidBody>`

### StaticBody

- **Path:** `src/physics/StaticBody.tsx`
- **Purpose:** Static physics body (no movement).
- **API:** `collider`, `position`, `rotation`
- **Events:** `onCollision`
- **States:** `active`
- **Slots:** `<Collider>` components
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<StaticBody><BoxCollider /></StaticBody>`

### KinematicBody

- **Path:** `src/physics/KinematicBody.tsx`
- **Purpose:** Kinematic body (script-driven movement).
- **API:** `collider`, `position`, `rotation`
- **Events:** `onCollision`
- **States:** `active`
- **Slots:** `<Collider>` components
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<KinematicBody><BoxCollider /></KinematicBody>`

### Collider

- **Path:** `src/physics/Collider.tsx`
- **Purpose:** Base collider component.
- **API:** `shape` (string), `size` (Vector3), `offset` (Vector3), `rotation` (Euler), `isTrigger` (bool)
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<Collider shape="box" size={[1,1,1]} />`

### BoxCollider

- **Path:** `src/physics/BoxCollider.tsx`
- **Purpose:** Box-shaped collider.
- **API:** `size` (Vector3), `offset`, `rotation`, `isTrigger`
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<BoxCollider size={[2,1,2]} />`

### SphereCollider

- **Path:** `src/physics/SphereCollider.tsx`
- **Purpose:** Sphere-shaped collider.
- **API:** `radius` (number), `offset`, `isTrigger`
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<SphereCollider radius={1} />`

### CapsuleCollider

- **Path:** `src/physics/CapsuleCollider.tsx`
- **Purpose:** Capsule-shaped collider.
- **API:** `radius` (number), `height` (number), `offset`, `rotation`, `isTrigger`
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<CapsuleCollider radius={0.5} height={2} />`

### MeshCollider

- **Path:** `src/physics/MeshCollider.tsx`
- **Purpose:** Triangle mesh collider.
- **API:** `mesh` (Geometry), `isTrigger` (bool), `convex` (bool)
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<MeshCollider mesh={geometry} convex />`

### ConvexHullCollider

- **Path:** `src/physics/ConvexHullCollider.tsx`
- **Purpose:** Convex hull collider.
- **API:** `mesh` (Geometry), `isTrigger` (bool)
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<ConvexHullCollider mesh={geometry} />`

### HeightfieldCollider

- **Path:** `src/physics/HeightfieldCollider.tsx`
- **Purpose:** Heightmap-based collider.
- **API:** `heightMap` (array), `size` (Vector2), `isTrigger` (bool)
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `active`, `trigger`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<HeightfieldCollider heightMap={heightData} size={[10,10]} />`

### Constraint

- **Path:** `src/physics/Constraint.tsx`
- **Purpose:** Base constraint component.
- **API:** `body1`, `body2`, `type` (string)
- **Events:** `onBreak`, `onUpdate`
- **States:** `active`, `broken`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<Constraint body1={body1} body2={body2} type="hinge" />`

### HingeConstraint

- **Path:** `src/physics/HingeConstraint.tsx`
- **Purpose:** Hinge constraint (rotation around one axis).
- **API:** `body1`, `body2`, `anchor` (Vector3), `axis` (Vector3), `limits` (object)
- **Events:** `onBreak`, `onUpdate`
- **States:** `active`, `broken`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<HingeConstraint body1={body1} body2={body2} anchor={[0,0,0]} axis={[0,0,1]} />`

### BallConstraint

- **Path:** `src/physics/BallConstraint.tsx`
- **Purpose:** Ball-and-socket constraint.
- **API:** `body1`, `body2`, `anchor`, `limits`
- **Events:** `onBreak`, `onUpdate`
- **States:** `active`, `broken`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<BallConstraint body1={body1} body2={body2} anchor={[0,0,0]} />`

### SliderConstraint

- **Path:** `src/physics/SliderConstraint.tsx`
- **Purpose:** Slider constraint (translation along one axis).
- **API:** `body1`, `body2`, `anchor`, `axis`, `limits`
- **Events:** `onBreak`, `onUpdate`
- **States:** `active`, `broken`
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<SliderConstraint body1={body1} body2={body2} axis={[0,0,1]} limits={[-1,1]} />`

### Ragdoll

- **Path:** `src/physics/Ragdoll.tsx`
- **Purpose:** Ragdoll physics for characters.
- **API:** `skeleton`, `colliders` (array), `constraints` (array)
- **Events:** `onActivate`, `onDeactivate`, `onUpdate`
- **States:** `active`, `inactive`
- **Slots:** Physics bodies and colliders
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<Ragdoll skeleton={skeleton}><RigidBody ... /></Ragdoll>`

### VehicleBody

- **Path:** `src/physics/VehicleBody.tsx`
- **Purpose:** Vehicle physics with wheels.
- **API:** `chassis`, `wheels` (array), `suspension` (object), `engineForce` (number), `brake` (number)
- **Events:** `onUpdate`, `onCollision`
- **Variants:** `Car`, `Motorcycle`, `Truck`
- **States:** `driving`, `idle`, `airborne`
- **Slots:** `<Wheel>` components
- **Dependencies:** `Rapier` or `Ammo.js`
- **Usage:** `<VehicleBody chassis={body}><Wheel ... /></VehicleBody>`

---

## Controls

### FirstPersonControls

- **Path:** `src/controls/FirstPersonControls.tsx`
- **Purpose:** First-person WASD + mouse look.
- **API:** `camera`, `target` (Vector3), `movementSpeed` (number), `lookSpeed` (number), `enableLock` (bool)
- **Events:** `onMove`, `onLook`, `onLock`
- **States:** `locked`, `unlocked`, `moving`
- **Accessibility:** `pointerLock` support
- **Dependencies:** Three.js `PointerLockControls`
- **Usage:** `<FirstPersonControls camera={camera} movementSpeed={10} />`

### ThirdPersonControls

- **Path:** `src/controls/ThirdPersonControls.tsx`
- **Purpose:** Third-person camera following target.
- **API:** `camera`, `target` (Object3D), `distance` (number), `height` (number), `smoothDamping` (number)
- **Events:** `onUpdate`, `onOrbit`
- **States:** `following`, `orbiting`, `idle`
- **Usage:** `<ThirdPersonControls camera={camera} target={player} distance={5} />`

### OrbitControls

- **Path:** `src/controls/OrbitControls.tsx`
- **Purpose:** Orbital camera inspection.
- **API:** `camera`, `target` (Vector3), `minDistance` (number), `maxDistance` (number), `enablePan` (bool), `enableZoom` (bool), `enableRotate` (bool)
- **Events:** `onStart`, `onEnd`, `onUpdate`
- **States:** `idle`, `rotating`, `zooming`, `panning`
- **Dependencies:** Three.js `OrbitControls`
- **Usage:** `<OrbitControls camera={camera} target={[0,0,0]} />`

### FlyControls

- **Path:** `src/controls/FlyControls.tsx`
- **Purpose:** Flight controls for free navigation.
- **API:** `camera`, `movementSpeed` (number), `rollSpeed` (number), `drag` (number)
- **Events:** `onUpdate`, `onMove`
- **States:** `flying`, `idle`
- **Dependencies:** Three.js `FlyControls`
- **Usage:** `<FlyControls camera={camera} movementSpeed={10} />`

### ArcballControls

- **Path:** `src/controls/ArcballControls.tsx`
- **Purpose:** Arcball with smooth damping.
- **API:** `camera`, `target`, `minDistance`, `maxDistance`, `damping` (number)
- **Events:** `onStart`, `onEnd`, `onUpdate`
- **States:** `idle`, `rotating`, `zooming`
- **Dependencies:** Three.js `ArcballControls`
- **Usage:** `<ArcballControls camera={camera} target={[0,0,0]} />`

### DragControls

- **Path:** `src/controls/DragControls.tsx`
- **Purpose:** Drag objects in 3D.
- **API:** `objects` (array), `camera`, `enabled` (bool), `onDragStart`, `onDrag`, `onDragEnd`
- **Events:** `onDragStart`, `onDrag`, `onDragEnd`
- **States:** `idle`, `dragging`
- **Dependencies:** Three.js `DragControls`
- **Usage:** `<DragControls objects={meshArray} camera={camera} />`

### TransformControls

- **Path:** `src/controls/TransformControls.tsx`
- **Purpose:** Transform gizmo for editing.
- **API:** `object` (Object3D), `camera`, `mode` (translate|rotate|scale), `snap` (number)
- **Events:** `onChange`, `onStart`, `onEnd`
- **States:** `editing`, `idle`
- **Dependencies:** Three.js `TransformControls`
- **Usage:** `<TransformControls object={mesh} mode="translate" />`

### DeviceOrientationControls

- **Path:** `src/controls/DeviceOrientationControls.tsx`
- **Purpose:** Device orientation controls.
- **API:** `camera`, `enabled` (bool), `alphaOffset` (number)
- **Events:** `onUpdate`
- **States:** `active`, `inactive`
- **Dependencies:** Three.js `DeviceOrientationControls`
- **Usage:** `<DeviceOrientationControls camera={camera} />`

### GamepadControls

- **Path:** `src/controls/GamepadControls.tsx`
- **Purpose:** Gamepad input controls.
- **API:** `index` (number), `deadZone` (number), `onButtonPress`, `onAxisMove`
- **Events:** `onButtonPress`, `onAxisMove`, `onConnect`, `onDisconnect`
- **States:** `connected`, `disconnected`
- **Dependencies:** Gamepad API
- **Usage:** `<GamepadControls index={0} onButtonPress={handlePress} />`

### KeyboardControls

- **Path:** `src/controls/KeyboardControls.tsx`
- **Purpose:** Keyboard input management.
- **API:** `keys` (array), `onKeyDown`, `onKeyUp`, `preventDefault` (bool)
- **Events:** `onKeyDown`, `onKeyUp`
- **States:** `idle`, `typing`
- **Accessibility:** Keyboard events
- **Usage:** `<KeyboardControls keys={['w','a','s','d']} onKeyDown={handleKey} />`

### MouseControls

- **Path:** `src/controls/MouseControls.tsx`
- **Purpose:** Mouse input management.
- **API:** `onMove`, `onClick`, `onDown`, `onUp`, `onWheel`
- **Events:** `onMove`, `onClick`, `onDown`, `onUp`, `onWheel`
- **States:** `active`, `idle`
- **Accessibility:** Mouse events
- **Usage:** `<MouseControls onMove={handleMouseMove} />`

### TouchControls

- **Path:** `src/controls/TouchControls.tsx`
- **Purpose:** Touch input management.
- **API:** `onTouchStart`, `onTouchMove`, `onTouchEnd`, `multitouch` (bool)
- **Events:** `onTouchStart`, `onTouchMove`, `onTouchEnd`
- **States:** `active`, `idle`
- **Accessibility:** Touch events
- **Usage:** `<TouchControls onTouchMove={handleTouch} />`

### VRControls

- **Path:** `src/controls/VRControls.tsx`
- **Purpose:** VR headset controls.
- **API:** `camera`, `onPoseUpdate`, `referenceSpace`
- **Events:** `onPoseUpdate`, `onConnect`, `onDisconnect`
- **States:** `connected`, `disconnected`, `active`
- **Dependencies:** WebVR/WebXR API
- **Usage:** `<VRControls camera={camera} />`

### XRControls

- **Path:** `src/controls/XRControls.tsx`
- **Purpose:** WebXR extended reality controls.
- **API:** `camera`, `onSessionStart`, `onSessionEnd`, `referenceSpace`
- **Events:** `onSessionStart`, `onSessionEnd`, `onPoseUpdate`
- **States:** `initializing`, `active`, `inactive`
- **Dependencies:** WebXR Device API
- **Usage:** `<XRControls camera={camera} onSessionStart={handleStart} />`

### SmoothDampingControls

- **Path:** `src/controls/SmoothDampingControls.tsx`
- **Purpose:** Controls with smooth damping.
- **API:** `camera`, `target`, `damping` (number), `smoothTime` (number)
- **Events:** `onUpdate`
- **States:** `idle`, `smoothing`
- **Usage:** `<SmoothDampingControls camera={camera} target={[0,0,0]} damping={0.1} />`

---

## Effects

### EffectComposer

- **Path:** `src/effects/EffectComposer.tsx`
- **Purpose:** Orchestrates post-processing passes.
- **API:** `renderer`, `size` (object), `pixelRatio` (number)
- **Events:** `onRender`, `onResize`
- **States:** `rendering`, `idle`
- **Slots:** `<RenderPass>` and pass components
- **Dependencies:** `EffectComposer` from three/addons
- **Usage:** `<EffectComposer renderer={renderer}><RenderPass /></EffectComposer>`

### RenderPass

- **Path:** `src/effects/RenderPass.tsx`
- **Purpose:** Renders scene to composer.
- **API:** `scene`, `camera`, `clearColor`, `clearAlpha`
- **Events:** `onRender`
- **States:** `rendering`
- **Dependencies:** `RenderPass` from three/addons
- **Usage:** `<RenderPass scene={scene} camera={camera} />`

### ShaderPass

- **Path:** `src/effects/ShaderPass.tsx`
- **Purpose:** Applies custom shader effect.
- **API:** `shader`, `uniforms` (object)
- **Events:** `onRender`
- **States:** `rendering`
- **Dependencies:** `ShaderPass` from three/addons
- **Usage:** `<ShaderPass shader={customShader} uniforms={uniforms} />`

### UnrealBloomPass

- **Path:** `src/effects/UnrealBloomPass.tsx`
- **Purpose:** Bloom/glow effect.
- **API:** `strength` (number), `radius` (number), `threshold` (number)
- **Events:** `onRender`
- **Dependencies:** `UnrealBloomPass` from three/addons
- **Usage:** `<UnrealBloomPass strength={0.5} radius={0.4} threshold={0.1} />`

### SSAOPass

- **Path:** `src/effects/SSAOPass.tsx`
- **Purpose:** Screen-space ambient occlusion.
- **API:** `radius` (number), `distance` (number), `intensity` (number), `bias` (number)
- **Events:** `onRender`
- **Dependencies:** `SSAOPass` from three/addons
- **Usage:** `<SSAOPass radius={0.5} intensity={1} />`

### SSRPass

- **Path:** `src/effects/SSRPass.tsx`
- **Purpose:** Screen-space reflections.
- **API:** `maxDistance` (number), `thickness` (number), `color`, `resolution`
- **Events:** `onRender`
- **Dependencies:** `SSRPass` from three/addons
- **Usage:** `<SSRPass maxDistance={100} thickness={0.5} />`

### DepthOfFieldPass

- **Path:** `src/effects/DepthOfFieldPass.tsx`
- **Purpose:** Depth of field effect.
- **API:** `focusDistance` (number), `focalLength` (number), `aperture` (number), `maxBlur` (number)
- **Events:** `onRender`
- **Dependencies:** `DepthOfFieldPass` from three/addons
- **Usage:** `<DepthOfFieldPass focusDistance={10} focalLength={50} aperture={2.8} />`

### BokehPass

- **Path:** `src/effects/BokehPass.tsx`
- **Purpose:** Bokeh depth of field.
- **API:** `focus` (number), `aperture` (number), `maxblur` (number), `width` (number), `height` (number)
- **Events:** `onRender`
- **Dependencies:** `BokehPass` from three/addons
- **Usage:** `<BokehPass focus={1} aperture={0.025} maxblur={0.01} />`

### FXAAPass

- **Path:** `src/effects/FXAAPass.tsx`
- **Purpose:** Fast approximate anti-aliasing.
- **API:** `resolution` (array), `enabled` (bool)
- **Events:** `onRender`
- **Dependencies:** `FXAAShader` from three/addons
- **Usage:** `<FXAAPass resolution={[1920,1080]} />`

### SMAAPass

- **Path:** `src/effects/SMAAPass.tsx`
- **Purpose:** Subpixel morphological anti-aliasing.
- **API:** `resolution`, `enabled`
- **Events:** `onRender`
- **Dependencies:** `SMAAPass` from three/addons
- **Usage:** `<SMAAPass resolution={[1920,1080]} />`

### TAAPass

- **Path:** `src/effects/TAAPass.tsx`
- **Purpose:** Temporal anti-aliasing.
- **API:** `resolution`, `sampleCount` (number), `enabled`
- **Events:** `onRender`
- **Dependencies:** `TAAPass` from three/addons
- **Usage:** `<TAAPass resolution={[1920,1080]} sampleCount={4} />`

### GlitchPass

- **Path:** `src/effects/GlitchPass.tsx`
- **Purpose:** Digital glitch effect.
- **API:** `amount` (number), `speed` (number), `mix` (number)
- **Events:** `onRender`
- **Dependencies:** `GlitchPass` from three/addons
- **Usage:** `<GlitchPass amount={0.5} speed={0.2} />`

### RGBShiftPass

- **Path:** `src/effects/RGBShiftPass.tsx`
- **Purpose:** RGB color shift effect.
- **API:** `amount` (number), `angle` (number)
- **Events:** `onRender`
- **Dependencies:** `RGBShiftShader` from three/addons
- **Usage:** `<RGBShiftPass amount={0.005} angle={0.1} />`

### DotScreenPass

- **Path:** `src/effects/DotScreenPass.tsx`
- **Purpose:** Dot screen/halftone effect.
- **API:** `scale` (number), `angle` (number)
- **Events:** `onRender`
- **Dependencies:** `DotScreenShader` from three/addons
- **Usage:** `<DotScreenPass scale={1} angle={0.5} />`

### HalftonePass

- **Path:** `src/effects/HalftonePass.tsx`
- **Purpose:** Halftone print effect.
- **API:** `shape` (number), `radius` (number), `rotateR` (number), `rotateG` (number), `rotateB` (number), `scatter` (number)
- **Events:** `onRender`
- **Dependencies:** `HalftoneShader` from three/addons
- **Usage:** `<HalftonePass shape={1} radius={4} />`

### OutlinePass

- **Path:** `src/effects/OutlinePass.tsx`
- **Purpose:** Adds outlines to selected objects.
- **API:** `edges` (array), `color`, `thickness` (number), `alpha` (number)
- **Events:** `onRender`
- **Dependencies:** `OutlinePass` from three/addons
- **Usage:** `<OutlinePass edges={[mesh1,mesh2]} color="red" thickness={1} />`

### BlurPass

- **Path:** `src/effects/BlurPass.tsx`
- **Purpose:** Blur effect.
- **API:** `sigma` (number), `resolution`
- **Events:** `onRender`
- **Dependencies:** `BlurPass` from three/addons
- **Usage:** `<BlurPass sigma={2} />`

### ReflectorPass

- **Path:** `src/effects/ReflectorPass.tsx`
- **Purpose:** Creates reflections.
- **API:** `geometry`, `camera`, `resolution`, `mirror` (bool)
- **Events:** `onRender`
- **Dependencies:** `Reflector` from three/addons
- **Usage:** `<ReflectorPass geometry={plane} camera={camera} />`

### RefractorPass

- **Path:** `src/effects/RefractorPass.tsx`
- **Purpose:** Creates refractions.
- **API:** `geometry`, `camera`, `resolution`, `ratio` (number)
- **Events:** `onRender`
- **Dependencies:** `Refractor` from three/addons
- **Usage:** `<RefractorPass geometry={sphere} camera={camera} />`

### WaterPass

- **Path:** `src/effects/WaterPass.tsx`
- **Purpose:** Water surface simulation.
- **API:** `geometry`, `texture`, `flowSpeed` (number), `scale` (number)
- **Events:** `onRender`, `onUpdate`
- **States:** `rendering`, `idle`
- **Dependencies:** `Water` from three/addons
- **Usage:** `<WaterPass geometry={plane} texture={waterTexture} flowSpeed={0.1} />`

### FogPass

- **Path:** `src/effects/FogPass.tsx`
- **Purpose:** Adds fog effect.
- **API:** `color`, `near` (number), `far` (number), `density` (number)
- **Events:** `onRender`
- **Variants:** `LinearFog`, `ExponentialFog`
- **Dependencies:** `Fog` from three
- **Usage:** `<FogPass color={0x000000} near={1} far={100} />`

### CustomShaderPass

- **Path:** `src/effects/CustomShaderPass.tsx`
- **Purpose:** Custom shader pass.
- **API:** `vertexShader` (string), `fragmentShader` (string), `uniforms` (object)
- **Events:** `onRender`, `onCompile`
- **States:** `compiling`, `rendering`
- **Dependencies:** `ShaderPass` from three/addons
- **Usage:** `<CustomShaderPass vertexShader={vs} fragmentShader={fs} uniforms={uniforms} />`

---

## Particles

### ParticleSystem

- **Path:** `src/particles/ParticleSystem.tsx`
- **Purpose:** Full-featured particle system.
- **API:** `emitter`, `count` (number), `lifeTime` (number), `loop` (bool)
- **Events:** `onUpdate`, `onEmit`, `onExpire`
- **States:** `emitting`, `paused`, `stopped`
- **Slots:** `<ParticleEmitter>` components
- **Usage:** `<ParticleSystem count={1000}><ParticleEmitter ... /></ParticleSystem>`

### Points

- **Path:** `src/particles/Points.tsx`
- **Purpose:** Points geometry.
- **API:** `positions` (array), `colors` (array), `sizes` (array), `opacity` (number)
- **Events:** `onUpdate`
- **States:** `ready`
- **Slots:** `<PointsMaterial>`
- **Dependencies:** Three.js `Points`
- **Usage:** `<Points positions={positionsArray}><PointsMaterial /></Points>`

### SpriteParticles

- **Path:** `src/particles/SpriteParticles.tsx`
- **Purpose:** Sprite-based particles.
- **API:** `texture`, `count` (number), `lifeTime` (number), `loop` (bool)
- **Events:** `onUpdate`, `onEmit`
- **States:** `emitting`, `paused`, `stopped`
- **Dependencies:** Three.js `Sprite`
- **Usage:** `<SpriteParticles texture={spriteTexture} count={500} />`

### GPUParticles

- **Path:** `src/particles/GPUParticles.tsx`
- **Purpose:** GPU-accelerated particles.
- **API:** `count` (number), `positions` (array), `velocities` (array), `lifeTime` (number)
- **Events:** `onUpdate`
- **States:** `running`, `paused`
- **Dependencies:** Three.js `Points`, `ComputeShader`
- **Usage:** `<GPUParticles count={10000} positions={posData} velocities={velData} />`

### CPUParticles

- **Path:** `src/particles/CPUParticles.tsx`
- **Purpose:** CPU-based particles for low-end devices.
- **API:** `count` (number), `emitter`, `lifeTime` (number), `loop` (bool)
- **Events:** `onUpdate`
- **States:** `running`, `paused`
- **Usage:** `<CPUParticles count={500} emitter={emitter} />`

### ParticleEmitter

- **Path:** `src/particles/ParticleEmitter.tsx`
- **Purpose:** Particle emission behavior.
- **API:** `rate` (number), `position` (Vector3), `velocity` (Vector3), `spread` (Vector3), `lifeTime` (number)
- **Events:** `onEmit`, `onUpdate`
- **Variants:** `Point`, `Sphere`, `Box`, `Cone`
- **States:** `emitting`, `idle`
- **Usage:** `<ParticleEmitter rate={10} position={[0,0,0]} velocity={[0,1,0]} />`

### ParticleBurst

- **Path:** `src/particles/ParticleBurst.tsx`
- **Purpose:** Single burst of particles.
- **API:** `count` (number), `duration` (number), `force` (number), `spread` (Vector3)
- **Events:** `onBurst`, `onComplete`
- **States:** `bursting`, `idle`
- **Usage:** `<ParticleBurst count={100} duration={0.5} force={10} />`

### ParticleTrail

- **Path:** `src/particles/ParticleTrail.tsx`
- **Purpose:** Trail behind moving objects.
- **API:** `target` (Object3D), `length` (number), `decay` (number), `color`
- **Events:** `onUpdate`
- **States:** `trailing`, `idle`
- **Usage:** `<ParticleTrail target={movingObject} length={50} decay={0.95} />`

### ParticlePhysics

- **Path:** `src/particles/ParticlePhysics.tsx`
- **Purpose:** Physics for particles.
- **API:** `gravity` (Vector3), `damping` (number), `wind` (Vector3), `turbulence` (number)
- **Events:** `onUpdate`
- **States:** `active`, `inactive`
- **Usage:** `<ParticlePhysics gravity={[0,-1,0]} damping={0.9} />`

### ParticleAttractor

- **Path:** `src/particles/ParticleAttractor.tsx`
- **Purpose:** Attracts particles to a point.
- **API:** `position` (Vector3), `force` (number), `radius` (number), `falloff` (number)
- **Events:** `onUpdate`
- **States:** `active`, `inactive`
- **Usage:** `<ParticleAttractor position={[0,0,0]} force={1} radius={5} />`

### ParticleNoise

- **Path:** `src/particles/ParticleNoise.tsx`
- **Purpose:** Adds Perlin/Simplex noise to particles.
- **API:** `amplitude` (number), `frequency` (number), `octaves` (number), `seed` (number)
- **Events:** `onUpdate`
- **States:** `active`, `inactive`
- **Usage:** `<ParticleNoise amplitude={1} frequency={0.5} octaves={3} />`

---

## UI

### HealthBar

- **Path:** `src/ui/HealthBar.tsx`
- **Purpose:** Health points progress bar.
- **API:** `value` (number), `max` (number), `color` (string), `style` (object), `animated` (bool)
- **Events:** `onChange`, `onComplete`
- **Variants:** `Horizontal`, `Vertical`, `Radial`
- **States:** `full`, `partial`, `empty`, `critical`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Usage:** `<HealthBar value={75} max={100} color="red" />`

### StaminaBar

- **Path:** `src/ui/StaminaBar.tsx`
- **Purpose:** Stamina/energy progress bar.
- **API:** `value`, `max`, `color`, `regenRate` (number), `drainRate` (number)
- **Events:** `onChange`, `onEmpty`, `onFull`
- **Variants:** `Horizontal`, `Vertical`, `Radial`
- **States:** `full`, `partial`, `empty`, `regen`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Usage:** `<StaminaBar value={50} max={100} color="yellow" regenRate={0.5} />`

### AmmoCounter

- **Path:** `src/ui/AmmoCounter.tsx`
- **Purpose:** Ammunition count display.
- **API:** `ammo` (number), `max` (number), `reserve` (number), `type` (string)
- **Events:** `onReload`, `onEmpty`
- **Variants:** `Numeric`, `Iconic`, `Hybrid`
- **States:** `full`, `partial`, `empty`, `reload`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label` for screen readers
- **Usage:** `<AmmoCounter ammo={30} max={30} reserve={90} type="rifle" />`

### Crosshair

- **Path:** `src/ui/Crosshair.tsx`
- **Purpose:** Aiming reticle.
- **API:** `color`, `size` (number), `gap` (number), `thickness` (number), `dot` (bool)
- **Events:** `onHit`, `onMiss`
- **Variants:** `Dot`, `Cross`, `Circle`, `Custom`
- **States:** `idle`, `hover`, `hit`, `miss`
- **Styling:** Tailwind CSS
- **Usage:** `<Crosshair color="white" size={20} gap={4} />`

### MiniMap

- **Path:** `src/ui/MiniMap.tsx`
- **Purpose:** Top-down radar view.
- **API:** `camera`, `size` (number), `zoom` (number), `markers` (array), `showFog` (bool)
- **Events:** `onClick`, `onHover`
- **Variants:** `Circular`, `Square`, `Fullscreen`
- **States:** `active`, `hidden`
- **Slots:** `<MapMarker>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Mini Map"`
- **Usage:** `<MiniMap camera={camera} size={200} zoom={0.5} markers={markers} />`

### Compass

- **Path:** `src/ui/Compass.tsx`
- **Purpose:** Directional compass.
- **API:** `heading` (number), `northOffset` (number), `markers` (array), `visible` (bool)
- **Events:** `onChange`
- **Variants:** `Circular`, `Linear`, `3D`
- **States:** `active`, `hidden`
- **Slots:** `<CompassMarker>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Compass"`
- **Usage:** `<Compass heading={45} northOffset={0} />`

### DamageIndicator

- **Path:** `src/ui/DamageIndicator.tsx`
- **Purpose:** Visual damage feedback.
- **API:** `intensity` (number), `color`, `fadeTime` (number), `direction`
- **Events:** `onTrigger`, `onComplete`
- **Variants:** `ScreenFlash`, `Directional`, `BloodSplat`
- **States:** `idle`, `triggered`, `fading`
- **Styling:** Tailwind CSS
- **Usage:** `<DamageIndicator intensity={0.5} color="red" fadeTime={0.3} />`

### InteractionPrompt

- **Path:** `src/ui/InteractionPrompt.tsx`
- **Purpose:** Interactable object prompts.
- **API:** `text` (string), `icon` (string), `key` (string), `visible` (bool), `position`
- **Events:** `onInteract`, `onDismiss`
- **Variants:** `Text`, `Icon`, `Keybind`
- **States:** `visible`, `hidden`, `interacting`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label` for interactable
- **Usage:** `<InteractionPrompt text="Press E" icon="hand" key="E" visible />`

### DialogUI

- **Path:** `src/ui/DialogUI.tsx`
- **Purpose:** Dialogue system.
- **API:** `speaker` (string), `text` (string), `choices` (array), `portrait`, `autoAdvance` (bool)
- **Events:** `onChoice`, `onNext`, `onComplete`, `onSkip`
- **Variants:** `Subtitles`, `Fullscreen`, `Minimal`
- **States:** `idle`, `speaking`, `choosing`, `complete`
- **Slots:** `<DialogChoice>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-live` for dynamic text
- **Usage:** `<DialogUI speaker="NPC" text="Hello!" choices={[{text:"Hi"}]} />`

### InventoryUI

- **Path:** `src/ui/InventoryUI.tsx`
- **Purpose:** Grid/list inventory management.
- **API:** `items` (array), `slots` (number), `selected`, `dragEnabled` (bool), `dropEnabled` (bool)
- **Events:** `onSelect`, `onUse`, `onDrop`, `onDrag`
- **Variants:** `Grid`, `List`, `Carousel`
- **States:** `open`, `closed`, `selecting`
- **Slots:** `<InventorySlot>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label` for inventory, `role="grid"`
- **Usage:** `<InventoryUI items={inventory} slots={20} onSelect={handleSelect} />`

### QuestLog

- **Path:** `src/ui/QuestLog.tsx`
- **Purpose:** Active and completed quests.
- **API:** `quests` (array), `active` (array), `completed` (array), `selected`
- **Events:** `onSelect`, `onTrack`, `onComplete`
- **Variants:** `Sidebar`, `Fullscreen`, `Popup`
- **States:** `open`, `closed`, `tracking`
- **Slots:** `<QuestItem>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Quest Log"`
- **Usage:** `<QuestLog quests={questList} active={activeQuests} />`

### SkillTree

- **Path:** `src/ui/SkillTree.tsx`
- **Purpose:** Visual skill tree.
- **API:** `skills` (array), `connections` (array), `points` (number), `selected`
- **Events:** `onSelect`, `onUnlock`, `onRefund`
- **Variants:** `Tree`, `Grid`, `Radial`
- **States:** `locked`, `available`, `unlocked`, `selected`
- **Slots:** `<SkillNode>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `role="tree"` navigation
- **Usage:** `<SkillTree skills={skillData} points={5} onUnlock={handleUnlock} />`

### ChatUI

- **Path:** `src/ui/ChatUI.tsx`
- **Purpose:** In-game chat interface.
- **API:** `messages` (array), `inputEnabled` (bool), `maxMessages` (number), `channels` (array)
- **Events:** `onSend`, `onReceive`, `onChannelSwitch`
- **Variants:** `Full`, `Minimal`, `Overlay`
- **States:** `open`, `closed`, `typing`
- **Slots:** `<ChatMessage>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Chat"`, `role="log"`
- **Usage:** `<ChatUI messages={chatMessages} onSend={sendMessage} />`

### Scoreboard

- **Path:** `src/ui/Scoreboard.tsx`
- **Purpose:** Player scores and rankings.
- **API:** `players` (array), `columns` (array), `sort` (string), `limit` (number)
- **Events:** `onSort`, `onSelect`
- **Variants:** `Table`, `List`, `Compact`
- **States:** `open`, `closed`, `updating`
- **Slots:** `<ScoreRow>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `role="table"`, `aria-label="Scoreboard"`
- **Usage:** `<Scoreboard players={playerData} columns={['name','score']} />`

### Timer

- **Path:** `src/ui/Timer.tsx`
- **Purpose:** Countdown or count-up timer.
- **API:** `duration` (number), `start` (bool), `pause` (bool), `reset` (bool), `format` (string)
- **Events:** `onStart`, `onPause`, `onReset`, `onComplete`, `onTick`
- **Variants:** `Digital`, `Analog`, `Progress`
- **States:** `idle`, `running`, `paused`, `complete`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-live` for updates
- **Usage:** `<Timer duration={60} start auto format="mm:ss" />`

### CheckpointUI

- **Path:** `src/ui/CheckpointUI.tsx`
- **Purpose:** Checkpoint notification.
- **API:** `text` (string), `icon` (string), `duration` (number), `visible` (bool)
- **Events:** `onReached`, `onDismiss`
- **Variants:** `Banner`, `Popup`, `Toast`
- **States:** `visible`, `hidden`, `reached`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-live="polite"`
- **Usage:** `<CheckpointUI text="Checkpoint Reached!" duration={3} />`

### PauseMenu

- **Path:** `src/ui/PauseMenu.tsx`
- **Purpose:** Pause screen with options.
- **API:** `visible` (bool), `resumeText` (string), `optionsText` (string), `quitText` (string)
- **Events:** `onResume`, `onOptions`, `onQuit`, `onToggle`
- **Variants:** `Overlay`, `Modal`, `Fullscreen`
- **States:** `visible`, `hidden`
- **Slots:** Custom menu items
- **Styling:** Tailwind CSS
- **Accessibility:** `role="dialog"`, focus trap
- **Usage:** `<PauseMenu visible={isPaused} onResume={resumeGame} onQuit={quitGame} />`

### MainMenu

- **Path:** `src/ui/MainMenu.tsx`
- **Purpose:** Main game menu.
- **API:** `title` (string), `logo`, `menuItems` (array), `background`
- **Events:** `onSelect`, `onPlay`, `onOptions`, `onQuit`
- **Variants:** `Overlay`, `Fullscreen`, `Minimal`
- **States:** `visible`, `hidden`
- **Slots:** `<MenuItem>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `role="menu"` navigation
- **Usage:** `<MainMenu title="My Game" menuItems={items} onPlay={startGame} />`

### LoadingScreen

- **Path:** `src/ui/LoadingScreen.tsx`
- **Purpose:** Loading screen with progress.
- **API:** `progress` (number), `text` (string), `icon`, `background`, `auto` (bool)
- **Events:** `onLoad`, `onComplete`, `onError`
- **Variants:** `ProgressBar`, `Spinner`, `Splash`
- **States:** `loading`, `complete`, `error`
- **Slots:** Custom loading content
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-live="polite"`
- **Usage:** `<LoadingScreen progress={loadingProgress} text="Loading..." />`

---

## Audio

### AudioListener

- **Path:** `src/audio/AudioListener.tsx`
- **Purpose:** Audio listener for 3D spatial audio.
- **API:** `position` (Vector3), `rotation` (Euler), `up` (Vector3)
- **Events:** `onUpdate`
- **States:** `active`, `inactive`
- **Dependencies:** Three.js `AudioListener`
- **Usage:** `<AudioListener position={[0,0,0]} />`

### AudioContext

- **Path:** `src/audio/AudioContext.tsx`
- **Purpose:** Manages audio context.
- **API:** `autoplay` (bool), `volume` (number), `muted` (bool), `contextState`
- **Events:** `onStateChange`, `onError`, `onReady`
- **States:** `suspended`, `running`, `closed`
- **Slots:** Audio components
- **Dependencies:** Web Audio API
- **Usage:** `<AudioContext autoplay><PositionalAudio /></AudioContext>`

### PositionalAudio

- **Path:** `src/audio/PositionalAudio.tsx`
- **Purpose:** 3D spatial sound source.
- **API:** `src`, `volume` (number), `loop` (bool), `autoplay` (bool), `position` (Vector3), `refDistance` (number), `rolloffFactor` (number)
- **Events:** `onPlay`, `onPause`, `onEnd`, `onLoad`
- **States:** `loading`, `playing`, `paused`, `stopped`
- **Dependencies:** Three.js `PositionalAudio`
- **Usage:** `<PositionalAudio src="/sound.mp3" position={[0,0,0]} loop />`

### AmbientAudio

- **Path:** `src/audio/AmbientAudio.tsx`
- **Purpose:** Background ambient sound.
- **API:** `src`, `volume`, `loop`, `autoplay`, `fadeIn` (number), `fadeOut` (number)
- **Events:** `onPlay`, `onPause`, `onEnd`, `onLoad`
- **States:** `loading`, `playing`, `paused`, `stopped`
- **Dependencies:** Three.js `Audio`
- **Usage:** `<AmbientAudio src="/ambient.mp3" volume={0.3} loop autoplay />`

### SoundEffect

- **Path:** `src/audio/SoundEffect.tsx`
- **Purpose:** One-shot sound effect.
- **API:** `src`, `volume`, `position` (Vector3), `trigger` (any), `delay` (number)
- **Events:** `onPlay`, `onLoad`, `onComplete`
- **States:** `idle`, `playing`, `complete`
- **Dependencies:** Three.js `Audio`
- **Usage:** `<SoundEffect src="/sfx.mp3" trigger={action} volume={0.5} />`

### MusicTrack

- **Path:** `src/audio/MusicTrack.tsx`
- **Purpose:** Music with crossfade.
- **API:** `src`, `volume`, `loop`, `autoplay`, `crossfade` (number)
- **Events:** `onPlay`, `onPause`, `onEnd`, `onLoad`, `onCrossfade`
- **States:** `loading`, `playing`, `paused`, `stopped`
- **Dependencies:** Three.js `Audio`
- **Usage:** `<MusicTrack src="/music.mp3" volume={0.5} loop autoplay crossfade={2} />`

### AudioMixer

- **Path:** `src/audio/AudioMixer.tsx`
- **Purpose:** Mixes multiple audio sources.
- **API:** `tracks` (array), `volumes` (array), `mutes` (array)
- **Events:** `onMix`, `onUpdate`
- **States:** `mixing`, `idle`
- **Slots:** Audio sources
- **Dependencies:** Web Audio API
- **Usage:** `<AudioMixer tracks={[track1,track2]} volumes={[0.5,1]} />`

### AudioFilter

- **Path:** `src/audio/AudioFilter.tsx`
- **Purpose:** Audio filter effects.
- **API:** `type` (string), `frequency` (number), `gain` (number), `Q` (number), `delay` (number), `reverb` (number)
- **Events:** `onUpdate`
- **Variants:** `LowPass`, `HighPass`, `BandPass`, `Reverb`, `Delay`
- **States:** `active`, `inactive`
- **Dependencies:** Web Audio API
- **Usage:** `<AudioFilter type="LowPass" frequency={1000} gain={1} />`

### AudioAnalyser

- **Path:** `src/audio/AudioAnalyser.tsx`
- **Purpose:** Audio analysis for visualization.
- **API:** `fftSize` (number), `smoothingTimeConstant` (number), `frequencyData`
- **Events:** `onData`, `onUpdate`
- **States:** `analysing`, `idle`
- **Dependencies:** Web Audio API
- **Usage:** `<AudioAnalyser fftSize={256} onData={handleData} />`

### 3DSound

- **Path:** `src/audio/3DSound.tsx`
- **Purpose:** 3D audio with custom falloff.
- **API:** `src`, `volume`, `loop`, `autoplay`, `minDistance` (number), `maxDistance` (number), `rolloff` (number)
- **Events:** `onPlay`, `onPause`, `onEnd`, `onLoad`
- **States:** `loading`, `playing`, `paused`, `stopped`
- **Dependencies:** Three.js `PositionalAudio`
- **Usage:** `<3DSound src="/3dsound.mp3" minDistance={1} maxDistance={20} />`

---

## Networking

### NetworkManager

- **Path:** `src/networking/NetworkManager.tsx`
- **Purpose:** Manages network connections.
- **API:** `url` (string), `port` (number), `protocol`, `autoConnect` (bool), `reconnect` (bool)
- **Events:** `onConnect`, `onDisconnect`, `onError`, `onData`, `onReconnect`
- **Variants:** `Client`, `Server`, `Peer`
- **States:** `disconnected`, `connecting`, `connected`, `error`
- **Slots:** Networked components
- **Dependencies:** WebSocket, Socket.io
- **Usage:** `<NetworkManager url="ws://localhost:8080" autoConnect><NetworkedEntity /></NetworkManager>`

### NetworkedEntity

- **Path:** `src/networking/NetworkedEntity.tsx`
- **Purpose:** Network-synchronized entity.
- **API:** `id` (string), `owner` (string), `syncPosition` (bool), `syncRotation` (bool), `syncScale` (bool), `replicationInterval` (number)
- **Events:** `onSync`, `onUpdate`, `onOwnershipChange`
- **States:** `synced`, `desynced`, `pending`
- **Slots:** 3D objects
- **Usage:** `<NetworkedEntity id={entityId} owner={playerId} syncPosition><Mesh /></NetworkedEntity>`

### NetworkTransform

- **Path:** `src/networking/NetworkTransform.tsx`
- **Purpose:** Synchronizes transform.
- **API:** `target`, `syncPosition`, `syncRotation`, `syncScale`, `interpolation` (bool), `extrapolation` (bool)
- **Events:** `onSync`, `onUpdate`
- **States:** `syncing`, `interpolating`
- **Usage:** `<NetworkTransform target={object} syncPosition interpolation />`

### NetworkAnimation

- **Path:** `src/networking/NetworkAnimation.tsx`
- **Purpose:** Synchronizes animation.
- **API:** `target`, `animationName` (string), `time` (number), `weight` (number)
- **Events:** `onSync`, `onUpdate`
- **States:** `syncing`, `idle`
- **Usage:** `<NetworkAnimation target={mesh} animationName="walk" />`

### NetworkRigidBody

- **Path:** `src/networking/NetworkRigidBody.tsx`
- **Purpose:** Synchronizes physics body.
- **API:** `target`, `syncPosition`, `syncVelocity` (bool), `interpolation`
- **Events:** `onSync`, `onUpdate`
- **States:** `syncing`, `interpolating`
- **Usage:** `<NetworkRigidBody target={rigidBody} syncPosition syncVelocity />`

### ReplicationManager

- **Path:** `src/networking/ReplicationManager.tsx`
- **Purpose:** Manages game state replication.
- **API:** `interval` (number), `priority`, `reliability` (bool), `redundancy` (number)
- **Events:** `onReplicate`, `onReceive`
- **States:** `replicating`, `idle`
- **Slots:** Replicable components
- **Usage:** `<ReplicationManager interval={0.1}><NetworkedEntity /></ReplicationManager>`

### RPCHandler

- **Path:** `src/networking/RPCHandler.tsx`
- **Purpose:** Remote Procedure Call handling.
- **API:** `methods` (object), `reliability` (bool), `timeout` (number)
- **Events:** `onCall`, `onResult`, `onError`, `onTimeout`
- **States:** `idle`, `calling`, `waiting`
- **Usage:** `<RPCHandler methods={rpcMethods} onCall={handleRPC} />`

### LagCompensation

- **Path:** `src/networking/LagCompensation.tsx`
- **Purpose:** Compensates for network lag.
- **API:** `target`, `historySize` (number), `latency` (number), `rewindTime` (number)
- **Events:** `onRewind`, `onCompensate`
- **States:** `active`, `inactive`
- **Usage:** `<LagCompensation target={player} historySize={100} latency={50} />`

### ClientPrediction

- **Path:** `src/networking/ClientPrediction.tsx`
- **Purpose:** Client-side prediction.
- **API:** `target`, `inputHistory` (array), `applyInput` (func), `reconcile` (func)
- **Events:** `onPredict`, `onReconcile`
- **States:** `predicting`, `reconciling`
- **Usage:** `<ClientPrediction target={player} inputHistory={inputs} applyInput={applyFn} />`

### ServerAuthority

- **Path:** `src/networking/ServerAuthority.tsx`
- **Purpose:** Server authority validation.
- **API:** `target`, `checksum` (func), `validationInterval` (number), `rejectOnMismatch` (bool)
- **Events:** `onValidate`, `onMismatch`, `onReject`
- **States:** `validating`, `valid`, `invalid`
- **Usage:** `<ServerAuthority target={player} validationInterval={1.0} />`

### PeerToPeer

- **Path:** `src/networking/PeerToPeer.tsx`
- **Purpose:** P2P mesh networking.
- **API:** `peers` (array), `maxConnections` (number), `signaling` (string), `iceServers` (array)
- **Events:** `onConnect`, `onDisconnect`, `onData`, `onError`
- **States:** `disconnected`, `connecting`, `connected`, `mesh`
- **Dependencies:** WebRTC
- **Usage:** `<PeerToPeer peers={peerList} signaling={signalServer} />`

### WebSocketClient

- **Path:** `src/networking/WebSocketClient.tsx`
- **Purpose:** WebSocket client connection.
- **API:** `url`, `protocols` (array), `reconnect` (bool), `reconnectInterval` (number), `maxReconnectAttempts` (number)
- **Events:** `onOpen`, `onMessage`, `onClose`, `onError`, `onReconnect`
- **States:** `connecting`, `open`, `closing`, `closed`, `reconnecting`
- **Dependencies:** WebSocket API
- **Usage:** `<WebSocketClient url="wss://server.com" onMessage={handleMessage} />`

### WebRTCConnection

- **Path:** `src/networking/WebRTCConnection.tsx`
- **Purpose:** WebRTC peer connection.
- **API:** `peer` (string), `iceServers` (array), `offer` (object), `answer` (object), `candidates` (array)
- **Events:** `onNegotiate`, `onData`, `onTrack`, `onStateChange`
- **States:** `new`, `negotiating`, `connecting`, `connected`, `failed`, `closed`
- **Dependencies:** WebRTC API
- **Usage:** `<WebRTCConnection peer={peerId} onData={handleData} />`

---

## VR/AR

### VRButton

- **Path:** `src/vr-ar/VRButton.tsx`
- **Purpose:** Enter VR button.
- **API:** `text` (string), `sessionOptions` (object), `onEnter`, `onExit`, `onError`
- **Events:** `onEnter`, `onExit`, `onError`
- **Variants:** `Button`, `Icon`, `Toggle`
- **States:** `idle`, `entering`, `active`, `exiting`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Enter VR"`
- **Dependencies:** WebXR API
- **Usage:** `<VRButton text="Enter VR" onEnter={startVR} />`

### ARButton

- **Path:** `src/vr-ar/ARButton.tsx`
- **Purpose:** Enter AR button.
- **API:** `text`, `sessionOptions`, `onEnter`, `onExit`, `onError`
- **Events:** `onEnter`, `onExit`, `onError`
- **Variants:** `Button`, `Icon`, `Toggle`
- **States:** `idle`, `entering`, `active`, `exiting`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Enter AR"`
- **Dependencies:** WebXR API
- **Usage:** `<ARButton text="Enter AR" onEnter={startAR} />`

### XRScene

- **Path:** `src/vr-ar/XRScene.tsx`
- **Purpose:** XR scene container.
- **API:** `sessionMode` (string), `referenceSpace`, `onSessionStart`, `onSessionEnd`
- **Events:** `onSessionStart`, `onSessionEnd`, `onFrame`
- **Variants:** `VR`, `AR`, `Mixed`
- **States:** `idle`, `initializing`, `active`, `inactive`
- **Slots:** 3D objects and XR components
- **Dependencies:** WebXR API
- **Usage:** `<XRScene sessionMode="immersive-vr"><XRController /></XRScene>`

### XRController

- **Path:** `src/vr-ar/XRController.tsx`
- **Purpose:** XR controller input.
- **API:** `hand` (string), `model`, `onButtonPress`, `onButtonRelease`, `onAxisMove`
- **Events:** `onButtonPress`, `onButtonRelease`, `onAxisMove`, `onUpdate`
- **Variants:** `Left`, `Right`, `Custom`
- **States:** `connected`, `disconnected`, `active`
- **Dependencies:** WebXR API
- **Usage:** `<XRController hand="right" onButtonPress={handlePress} />`

### HandTracking

- **Path:** `src/vr-ar/HandTracking.tsx`
- **Purpose:** Hand tracking for VR/AR.
- **API:** `enabled` (bool), `onHandPose`, `onPinch`, `onGrab`
- **Events:** `onHandPose`, `onPinch`, `onGrab`, `onRelease`
- **States:** `tracking`, `lost`, `idle`
- **Dependencies:** WebXR Hand Tracking
- **Usage:** `<HandTracking enabled onPinch={handlePinch} />`

### PlaneDetection

- **Path:** `src/vr-ar/PlaneDetection.tsx`
- **Purpose:** AR plane detection.
- **API:** `enabled` (bool), `onPlaneDetected`, `onPlaneUpdated`, `onPlaneRemoved`
- **Events:** `onPlaneDetected`, `onPlaneUpdated`, `onPlaneRemoved`
- **States:** `detecting`, `tracking`, `idle`
- **Dependencies:** WebXR Plane Detection
- **Usage:** `<PlaneDetection enabled onPlaneDetected={handlePlane} />`

### ImageTracking

- **Path:** `src/vr-ar/ImageTracking.tsx`
- **Purpose:** AR image tracking.
- **API:** `images` (array), `enabled` (bool), `onImageDetected`, `onImageLost`
- **Events:** `onImageDetected`, `onImageLost`, `onImageUpdated`
- **States:** `tracking`, `lost`, `idle`
- **Dependencies:** WebXR Image Tracking
- **Usage:** `<ImageTracking images={imageData} onImageDetected={handleImage} />`

### FaceTracking

- **Path:** `src/vr-ar/FaceTracking.tsx`
- **Purpose:** Face tracking for AR avatars.
- **API:** `enabled` (bool), `onFacePose`, `onBlendshapes`
- **Events:** `onFacePose`, `onBlendshapes`, `onTrackLost`
- **States:** `tracking`, `lost`, `idle`
- **Dependencies:** WebXR Face Tracking
- **Usage:** `<FaceTracking enabled onFacePose={updateAvatar} />`

### Passthrough

- **Path:** `src/vr-ar/Passthrough.tsx`
- **Purpose:** Passthrough camera view for AR.
- **API:** `enabled` (bool), `opacity` (number), `occlusion` (bool), `texture`
- **Events:** `onReady`, `onUpdate`
- **States:** `active`, `inactive`, `loading`
- **Dependencies:** WebXR Passthrough
- **Usage:** `<Passthrough enabled opacity={0.8} />`

### Teleportation

- **Path:** `src/vr-ar/Teleportation.tsx`
- **Purpose:** VR teleportation system.
- **API:** `enabled` (bool), `target` (Object3D), `navMesh`, `onTeleport`, `onPoint`
- **Events:** `onTeleport`, `onPoint`, `onCancel`
- **Variants:** `Line`, `Arc`, `Parabolic`
- **States:** `idle`, `aiming`, `teleporting`
- **Usage:** `<Teleportation enabled target={player} onTeleport={handleTeleport} />`

### Grabbing

- **Path:** `src/vr-ar/Grabbing.tsx`
- **Purpose:** VR grab interaction.
- **API:** `enabled` (bool), `grabbable` (array), `distance` (number), `onGrab`, `onRelease`
- **Events:** `onGrab`, `onRelease`, `onMove`
- **Variants:** `Direct`, `Ray`, `Force`
- **States:** `idle`, `grabbing`, `holding`
- **Usage:** `<Grabbing enabled grabbable={objects} onGrab={handleGrab} />`

### VRMovement

- **Path:** `src/vr-ar/VRMovement.tsx`
- **Purpose:** VR movement and locomotion.
- **API:** `type` (string), `speed` (number), `smoothRotation` (bool), `snapRotation` (number), `onMove`
- **Events:** `onMove`, `onTurn`, `onStop`
- **Variants:** `Smooth`, `Snap`, `Teleport`, `ArmSwing`
- **States:** `moving`, `turning`, `idle`
- **Usage:** `<VRMovement type="smooth" speed={2} onMove={handleMove} />`

---

## Terrain

### Terrain

- **Path:** `src/terrain/Terrain.tsx`
- **Purpose:** Generates terrain mesh.
- **API:** `size` (Vector2), `segments` (number), `heightMap`, `heightScale` (number), `texture`
- **Events:** `onGenerate`, `onUpdate`
- **Variants:** `Plane`, `Sphere`, `Torus`
- **States:** `generating`, `ready`
- **Dependencies:** Three.js `PlaneGeometry`
- **Usage:** `<Terrain size={[100,100]} segments={64} heightMap={heightData} />`

### Heightmap

- **Path:** `src/terrain/Heightmap.tsx`
- **Purpose:** Generates heightmap data.
- **API:** `width` (number), `height` (number), `scale` (number), `seed` (number), `octaves` (number)
- **Events:** `onGenerate`, `onUpdate`
- **States:** `generating`, `ready`
- **Usage:** `<Heightmap width={1024} height={1024} scale={10} seed={42} />`

### NoiseGenerator

- **Path:** `src/terrain/NoiseGenerator.tsx`
- **Purpose:** Perlin/Simplex noise generation.
- **API:** `type` (string), `frequency` (number), `amplitude` (number), `octaves` (number), `seed` (number)
- **Events:** `onGenerate`, `onUpdate`
- **Variants:** `Perlin`, `Simplex`, `Worley`
- **States:** `generating`, `ready`
- **Usage:** `<NoiseGenerator type="Perlin" frequency={0.1} amplitude={1} octaves={4} />`

### Water

- **Path:** `src/terrain/Water.tsx`
- **Purpose:** Realistic water surface.
- **API:** `size` (Vector2), `segments` (number), `color`, `flowSpeed` (number), `waveHeight` (number)
- **Events:** `onUpdate`
- **Variants:** `Ocean`, `Lake`, `River`
- **States:** `rendering`, `idle`
- **Dependencies:** Three.js `Water`
- **Usage:** `<Water size={[100,100]} color="#006994" flowSpeed={0.1} />`

### Grass

- **Path:** `src/terrain/Grass.tsx`
- **Purpose:** Instanced grass rendering.
- **API:** `area` (Vector2), `density` (number), `height` (number), `bladeTexture`, `color`
- **Events:** `onUpdate`
- **States:** `rendering`, `idle`
- **Dependencies:** Three.js `InstancedMesh`
- **Usage:** `<Grass area={[50,50]} density={1000} height={0.5} />`

### Tree

- **Path:** `src/terrain/Tree.tsx`
- **Purpose:** Tree generation and placement.
- **API:** `position` (Vector3), `height` (number), `canopyRadius` (number), `trunkRadius` (number), `type` (string)
- **Events:** `onGenerate`
- **Variants:** `Pine`, `Oak`, `Palm`
- **States:** `generating`, `ready`
- **Dependencies:** Three.js `Mesh`
- **Usage:** `<Tree position={[0,0,0]} height={5} type="Oak" />`

### Road

- **Path:** `src/terrain/Road.tsx`
- **Purpose:** Road/path generation.
- **API:** `path` (array), `width` (number), `material`, `curb` (bool)
- **Events:** `onGenerate`
- **Variants:** `Straight`, `Curved`, `Intersection`
- **States:** `generating`, `ready`
- **Dependencies:** Three.js `ExtrudeGeometry`
- **Usage:** `<Road path={pathPoints} width={4} material={roadMaterial} />`

### Biome

- **Path:** `src/terrain/Biome.tsx`
- **Purpose:** Biome generation and management.
- **API:** `type` (string), `area` (Vector2), `seed` (number), `features` (array), `climate`
- **Events:** `onGenerate`, `onUpdate`
- **Variants:** `Forest`, `Desert`, `Tundra`, `Jungle`
- **States:** `generating`, `ready`
- **Slots:** `<Tree>`, `<Grass>` components
- **Usage:** `<Biome type="Forest" area={[100,100]} seed={42} />`

### ChunkManager

- **Path:** `src/terrain/ChunkManager.tsx`
- **Purpose:** Manages terrain chunk loading.
- **API:** `camera`, `renderDistance` (number), `chunkSize` (number), `preloadDistance` (number)
- **Events:** `onChunkLoad`, `onChunkUnload`, `onChunkUpdate`
- **States:** `loading`, `rendering`, `idle`
- **Slots:** `<Terrain>` components
- **Usage:** `<ChunkManager camera={camera} renderDistance={5} chunkSize={16} />`

### LODSystem

- **Path:** `src/terrain/LODSystem.tsx`
- **Purpose:** Level of detail management.
- **API:** `camera`, `target`, `distances` (array), `levels` (array), `updateThreshold` (number)
- **Events:** `onLODChange`, `onUpdate`
- **States:** `updating`, `idle`
- **Slots:** `<Terrain>` components
- **Usage:** `<LODSystem camera={camera} distances={[10,50,100]} levels={[3,2,1]} />`

---

## Utility

### AxesHelper

- **Path:** `src/utility/AxesHelper.tsx`
- **Purpose:** Displays X/Y/Z axes.
- **API:** `size` (number), `position` (Vector3), `visible` (bool)
- **States:** `visible`, `hidden`
- **Dependencies:** Three.js `AxesHelper`
- **Usage:** `<AxesHelper size={5} position={[0,0,0]} />`

### GridHelper

- **Path:** `src/utility/GridHelper.tsx`
- **Purpose:** Displays a grid.
- **API:** `size` (number), `divisions` (number), `colorCenter`, `colorGrid`
- **States:** `visible`, `hidden`
- **Dependencies:** Three.js `GridHelper`
- **Usage:** `<GridHelper size={20} divisions={20} />`

### BoxHelper

- **Path:** `src/utility/BoxHelper.tsx`
- **Purpose:** Displays bounding box.
- **API:** `object` (Object3D), `color`, `visible`
- **Events:** `onUpdate`
- **States:** `visible`, `hidden`
- **Dependencies:** Three.js `BoxHelper`
- **Usage:** `<BoxHelper object={mesh} color="red" />`

### CameraHelper

- **Path:** `src/utility/CameraHelper.tsx`
- **Purpose:** Displays camera frustum.
- **API:** `camera`, `visible`, `size` (number)
- **Events:** `onUpdate`
- **States:** `visible`, `hidden`
- **Dependencies:** Three.js `CameraHelper`
- **Usage:** `<CameraHelper camera={camera} visible />`

### Stats

- **Path:** `src/utility/Stats.tsx`
- **Purpose:** Performance statistics overlay.
- **API:** `position` (string), `visible` (bool), `mode` (string)
- **Events:** `onUpdate`
- **Variants:** `FPS`, `GPU`, `Memory`
- **States:** `visible`, `hidden`
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Performance Stats"`
- **Dependencies:** `stats.js`
- **Usage:** `<Stats position="top-left" visible />`

### Profiler

- **Path:** `src/utility/Profiler.tsx`
- **Purpose:** Detailed performance profiling.
- **API:** `enabled` (bool), `logInterval` (number), `metrics` (array), `onData`
- **Events:** `onData`, `onUpdate`
- **States:** `active`, `inactive`
- **Usage:** `<Profiler enabled logInterval={1} onData={handleData} />`

### DebugUI

- **Path:** `src/utility/DebugUI.tsx`
- **Purpose:** Debug UI panel.
- **API:** `visible` (bool), `position`, `panels` (array), `onChange`
- **Events:** `onChange`, `onToggle`
- **States:** `visible`, `hidden`
- **Slots:** `<DebugPanel>` components
- **Styling:** Tailwind CSS
- **Accessibility:** `aria-label="Debug UI"`
- **Usage:** `<DebugUI visible><DebugPanel label="Scene" /></DebugUI>`

### Raycaster

- **Path:** `src/utility/Raycaster.tsx`
- **Purpose:** Raycasting for picking.
- **API:** `origin` (Vector3), `direction` (Vector3), `objects` (array), `onIntersection`
- **Events:** `onIntersection`, `onMiss`
- **States:** `active`, `inactive`
- **Dependencies:** Three.js `Raycaster`
- **Usage:** `<Raycaster origin={[0,0,0]} direction={[0,0,-1]} objects={objects} onIntersection={handlePick} />`

### IntersectionObserver

- **Path:** `src/utility/IntersectionObserver.tsx`
- **Purpose:** Observes object intersections.
- **API:** `objects` (array), `threshold` (number), `onEnter`, `onExit`
- **Events:** `onEnter`, `onStay`, `onExit`
- **States:** `observing`, `idle`
- **Dependencies:** Three.js
- **Usage:** `<IntersectionObserver objects={[mesh1,mesh2]} onEnter={handleEnter} />`

### FrustumCuller

- **Path:** `src/utility/FrustumCuller.tsx`
- **Purpose:** Frustum culling.
- **API:** `camera`, `objects` (array), `onCull`, `onVisible`
- **Events:** `onCull`, `onVisible`, `onUpdate`
- **States:** `culling`, `idle`
- **Dependencies:** Three.js `Frustum`
- **Usage:** `<FrustumCuller camera={camera} objects={meshArray} />`

### Octree

- **Path:** `src/utility/Octree.tsx`
- **Purpose:** Octree spatial partitioning.
- **API:** `bounds` (Vector3), `maxDepth` (number), `maxObjects` (number), `onUpdate`
- **Events:** `onUpdate`, `onInsert`, `onRemove`
- **States:** `active`, `idle`
- **Usage:** `<Octree bounds={[100,100,100]} maxDepth={8} />`

### QuadTree

- **Path:** `src/utility/QuadTree.tsx`
- **Purpose:** Quadtree spatial partitioning for 2D.
- **API:** `bounds` (Vector2), `maxDepth` (number), `maxObjects` (number), `onUpdate`
- **Events:** `onUpdate`, `onInsert`, `onRemove`
- **States:** `active`, `idle`
- **Usage:** `<QuadTree bounds={[100,100]} maxDepth={8} />`

### Pathfinder

- **Path:** `src/utility/Pathfinder.tsx`
- **Purpose:** A\* pathfinding.
- **API:** `navMesh`, `start` (Vector3), `end` (Vector3), `onPath`, `heuristic`
- **Events:** `onPath`, `onError`, `onUpdate`
- **Variants:** `AStar`, `Dijkstra`, `BFS`
- **States:** `idle`, `searching`, `complete`, `failed`
- **Usage:** `<Pathfinder navMesh={navMesh} start={startPos} end={endPos} onPath={handlePath} />`

### NavMesh

- **Path:** `src/utility/NavMesh.tsx`
- **Purpose:** Navigation mesh generation.
- **API:** `geometry`, `walkableArea`, `agentHeight` (number), `agentRadius` (number), `onBuild`
- **Events:** `onBuild`, `onUpdate`
- **States:** `building`, `ready`, `error`
- **Dependencies:** Recast/Detour
- **Usage:** `<NavMesh geometry={terrain} agentHeight={2} agentRadius={0.5} />`

### StateMachine

- **Path:** `src/utility/StateMachine.tsx`
- **Purpose:** Finite state machine.
- **API:** `initialState` (string), `states` (object), `transitions` (array), `onStateChange`
- **Events:** `onStateChange`, `onTransition`, `onError`
- **Slots:** `<State>` components
- **Usage:** `<StateMachine initialState="idle"><State name="idle" ... /></StateMachine>`

### EventBus

- **Path:** `src/utility/EventBus.tsx`
- **Purpose:** Global event bus.
- **API:** `enabled` (bool), `maxListeners` (number), `onEvent`
- **Events:** `onEvent`, `onError`
- **States:** `active`, `inactive`
- **Slots:** `<EventSubscriber>` components
- **Usage:** `<EventBus enabled><EventSubscriber event="game:start" handler={handleStart} /></EventBus>`

### TimeScale

- **Path:** `src/utility/TimeScale.tsx`
- **Purpose:** Controls global time scale.
- **API:** `scale` (number), `smooth` (bool), `duration` (number), `onChange`
- **Events:** `onChange`, `onStart`, `onEnd`
- **States:** `normal`, `scaled`, `transitioning`
- **Usage:** `<TimeScale scale={0.5} smooth duration={2} />`

### TweenEngine

- **Path:** `src/utility/TweenEngine.tsx`
- **Purpose:** Tween animation engine.
- **API:** `target` (object), `from` (any), `to` (any), `duration` (number), `easing` (string), `onComplete`
- **Events:** `onStart`, `onUpdate`, `onComplete`
- **States:** `idle`, `animating`, `complete`
- **Usage:** `<TweenEngine target={object} from={0} to={1} duration={1} easing="easeInOut" />`

---

## Extensions

### ReactThreeFiber

- **Path:** `src/extensions/ReactThreeFiber.tsx`
- **Purpose:** Bridge to React Three Fiber.
- **API:** `canvas`, `camera`, `shadows` (bool), `onCreated`, `frameloop` (string)
- **Events:** `onCreated`, `onError`, `onUpdate`
- **States:** `creating`, `ready`, `error`
- **Slots:** R3F components
- **Styling:** Responsive canvas
- **Dependencies:** `@react-three/fiber`
- **Usage:** `<ReactThreeFiber camera={camera}><R3FObject /></ReactThreeFiber>`

### ThreeJS

- **Path:** `src/extensions/ThreeJS.tsx`
- **Purpose:** Direct Three.js integration.
- **API:** `scene`, `camera`, `renderer`, `onUpdate`
- **Events:** `onUpdate`, `onRender`
- **States:** `ready`, `rendering`
- **Slots:** Three.js objects
- **Dependencies:** Three.js
- **Usage:** `<ThreeJS scene={scene} camera={camera} renderer={renderer} />`

### BabylonJS

- **Path:** `src/extensions/BabylonJS.tsx`
- **Purpose:** Babylon.js integration bridge.
- **API:** `engine`, `scene`, `camera`, `onCreated`
- **Events:** `onCreated`, `onUpdate`, `onRender`
- **States:** `creating`, `ready`, `rendering`
- **Slots:** Babylon objects
- **Dependencies:** Babylon.js
- **Usage:** `<BabylonJS engine={engine} scene={scene} camera={camera} />`

### PlayCanvas

- **Path:** `src/extensions/PlayCanvas.tsx`
- **Purpose:** PlayCanvas integration bridge.
- **API:** `app`, `scene`, `camera`, `onReady`
- **Events:** `onReady`, `onUpdate`
- **States:** `loading`, `ready`, `rendering`
- **Slots:** PlayCanvas entities
- **Dependencies:** PlayCanvas
- **Usage:** `<PlayCanvas app={app} scene={scene} camera={camera} />`

### UnityBridge

- **Path:** `src/extensions/UnityBridge.tsx`
- **Purpose:** Unity game engine integration.
- **API:** `unityInstance`, `onReady`, `sendMessage`, `onUnityEvent`
- **Events:** `onReady`, `onUnityEvent`, `onError`
- **States:** `loading`, `ready`, `error`
- **Dependencies:** Unity WebGL
- **Usage:** `<UnityBridge unityInstance={unity} sendMessage={sendMessageFn} />`

### WebGPU

- **Path:** `src/extensions/WebGPU.tsx`
- **Purpose:** WebGPU renderer integration.
- **API:** `adapter`, `device`, `format`, `canvas`, `onReady`
- **Events:** `onReady`, `onError`, `onFrame`
- **States:** `initializing`, `ready`, `rendering`, `error`
- **Dependencies:** WebGPU API
- **Usage:** `<WebGPU adapter={adapter} device={device} canvas={canvas} />`

### OpenXR

- **Path:** `src/extensions/OpenXR.tsx`
- **Purpose:** OpenXR standard for XR.
- **API:** `runtime`, `session`, `onSessionStart`, `onSessionEnd`, `onFrame`
- **Events:** `onSessionStart`, `onSessionEnd`, `onFrame`, `onError`
- **States:** `idle`, `initializing`, `active`, `inactive`
- **Dependencies:** OpenXR API
- **Usage:** `<OpenXR runtime={runtime} onSessionStart={handleStart} />`
