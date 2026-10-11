import { createContext, useContext, useMemo, useState } from 'react';
import { AM_ROUTINE, PM_ROUTINE } from '../data/routine.js';

const RoutineContext = createContext(null);

export function RoutineProvider({ children }) {
  const [am, setAm] = useState(AM_ROUTINE);
  const [pm, setPm] = useState(PM_ROUTINE);

  const toggleStep = (period, id) => {
    const setter = period === 'am' ? setAm : setPm;
    setter((steps) =>
      steps.map((step) =>
        step.id === id
          ? {
              ...step,
              completedAt: step.completedAt
                ? null
                : new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            }
          : step
      )
    );
  };

  // Folds AI-recommended actives (from a skin analysis) into the real AM/PM
  // routine state, skipping ones already present by title so re-syncing the
  // same scan is idempotent. Returns how many new steps were actually added.
  const addRecommendedSteps = (actives = []) => {
    const existingAmTitles = new Set(am.map((s) => s.title));
    const existingPmTitles = new Set(pm.map((s) => s.title));
    const newAm = [];
    const newPm = [];

    actives.forEach((active) => {
      const step = {
        id: `rec-${active.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        category: 'AI Recommended',
        tag: active.badge,
        title: active.name,
        description: active.note,
        meta: { icon: active.icon || 'science', label: 'From AI Analysis' },
        image: null,
        completedAt: null,
      };
      if (active.badge === 'PM') {
        if (!existingPmTitles.has(step.title)) newPm.push(step);
      } else if (!existingAmTitles.has(step.title)) {
        newAm.push(step);
      }
    });

    if (newAm.length) {
      setAm((steps) => [...steps, ...newAm.map((s, i) => ({ ...s, order: steps.length + i + 1 }))]);
    }
    if (newPm.length) {
      setPm((steps) => [...steps, ...newPm.map((s, i) => ({ ...s, order: steps.length + i + 1 }))]);
    }
    return newAm.length + newPm.length;
  };

  const value = useMemo(() => {
    const amDone = am.filter((s) => s.completedAt).length;
    const pmDone = pm.filter((s) => s.completedAt).length;
    return {
      am,
      pm,
      toggleStep,
      addRecommendedSteps,
      amProgress: { done: amDone, total: am.length, percent: Math.round((amDone / am.length) * 100) },
      pmProgress: { done: pmDone, total: pm.length, percent: Math.round((pmDone / pm.length) * 100) },
    };
  }, [am, pm, addRecommendedSteps]);

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>;
}

export function useRoutine() {
  const ctx = useContext(RoutineContext);
  if (!ctx) throw new Error('useRoutine must be used within RoutineProvider');
  return ctx;
}
