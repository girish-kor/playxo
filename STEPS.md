# Component Creation Steps

This document defines the **single, common pseudocode workflow** to follow for every component `.tsx` file in `playxo`.
The same steps apply to all components – from core primitives to loaders, effects, and UI elements.

---

1. **Read the component’s specification** from `DOCS.md` (path, purpose, API, events, states, slots, dependencies, variants, etc.).

2. **Import React and any required external libraries** (Three.js, loaders, helpers) plus type definitions.

3. **Define a TypeScript interface/type** for the component props, mapping each API field with its type and optionality.

4. **Declare the component function**, destructuring props with sensible defaults.

5. **Initialize internal state variables** (e.g., for `loading`, `ready`, `active`, etc.) using the appropriate React hooks.

6. **Set up refs or references** to underlying Three.js objects (e.g., via `useRef` or `forwardRef`) for imperative control.

7. **Implement callback handlers** for each documented event (e.g., `onChange`, `onUpdate`, `onLoad`), wiring them to props.

8. **Apply side effects** (using `useEffect` or similar) to synchronize prop changes with the underlying object, manage lifecycle events (`onReady`, `onBeforeRender`), and handle state transitions.

9. **Render the Three.js primitive or React component** corresponding to the element, passing down props, slots/children, and attaching refs.

10. **Optionally, forward the ref** to the outer component for parent access, and export the component as the default or named export.

---

_Use this checklist verbatim for every new component file._
