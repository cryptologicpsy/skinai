// Shared between main.jsx (which starts this as early as possible, before
// React even mounts, so the font fetch begins immediately) and App.jsx
// (which awaits the same promise to keep the splash screen up until icons
// are truly ready — not just until the auth check resolves). A single
// shared promise means both only ever trigger one font load, not two.
export const fontsReadyPromise =
  typeof document !== 'undefined' && document.fonts?.load
    ? Promise.race([
        document.fonts.load('400 24px "Material Symbols Outlined"'),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]).catch(() => {})
    : Promise.resolve();
