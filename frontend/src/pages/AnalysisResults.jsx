import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StackLayout from '../layouts/StackLayout.jsx';
import Icon from '../components/Icon.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useRoutine } from '../context/RoutineContext.jsx';
import { LATEST_SCAN_IMAGE, MOCK_ANALYSIS_RESULT } from '../data/analysis.js';

export default function AnalysisResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useToast();
  const { addRecommendedSteps } = useRoutine();
  const result = location.state?.result ?? MOCK_ANALYSIS_RESULT;
  const isSimulated = !location.state?.result;
  // The photo actually analyzed, when we arrived here right after a scan —
  // falls back to the stock sample image only when opened directly (e.g.
  // Dashboard's "Full Dossier" link) with no real scan behind it.
  const scanImage = location.state?.photo || LATEST_SCAN_IMAGE;
  const [activeZone, setActiveZone] = useState(null);
  const [routineUpdated, setRoutineUpdated] = useState(false);

  const tooltipText = activeZone
    ? result.zones.find((z) => z.id === activeZone)?.detail
    : 'Tap markers to inspect localized stratum layers';

  const handleUpdateRoutine = () => {
    const addedCount = addRecommendedSteps(result.recommendedActives);
    setRoutineUpdated(true);
    showToast(
      addedCount > 0
        ? `Added ${addedCount} new step${addedCount === 1 ? '' : 's'} to your routine`
        : 'These recommendations are already in your routine'
    );
    setTimeout(() => setRoutineUpdated(false), 2500);
  };

  return (
    <StackLayout title="AI Analysis Results" backTo="/dashboard">
      <div className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-lg">
        {isSimulated && (
          <div className="flex items-center gap-2 bg-surface-container-high/70 px-space-sm py-1.5 rounded-full self-start">
            <Icon name="science" className="text-[14px] text-on-surface-variant" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Simulated demo results</span>
          </div>
        )}

        <div className="relative bg-surface-container-lowest rounded-lg p-space-md shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="inline-flex items-center gap-space-xs text-secondary font-label-md text-label-md bg-secondary-container/40 px-space-sm py-1 rounded-full">
              <Icon name="auto_awesome" className="text-[14px]" />
              AI Skin Map
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Multi-Zone Telemetry
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
            <img className="w-full h-full object-cover" alt="AI facial zone analysis" src={scanImage} />
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-transparent to-black/10" />
            {result.zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone.id)}
                style={{ top: `${zone.y}%`, left: `${zone.x}%` }}
                className="absolute -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full text-on-surface shadow-md transition-transform active:scale-95"
              >
                <span className={`w-2 h-2 rounded-full ${zone.color} ${activeZone === zone.id ? 'animate-pulse' : ''}`} />
                <span className="font-label-sm text-label-sm font-semibold">
                  {zone.label} {zone.score}
                </span>
              </button>
            ))}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-space-sm py-1.5 bg-surface-container-lowest/95 backdrop-blur-md rounded-full">
              <p className="font-label-sm text-label-sm text-on-surface truncate flex items-center gap-1">
                <Icon name="verified" className="text-[14px] text-secondary" />
                {tooltipText}
              </p>
              <Icon name="touch_app" className="text-secondary text-[16px]" />
            </div>
          </div>

          <div className="mt-space-md pt-space-xs flex flex-col gap-space-sm">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-0.5">
                  Overall Equilibrium
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-normal">
                    {result.overallScore}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">/100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-space-sm py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-md">
                  <Icon name="spa" className="text-[16px]" />
                  {result.headline}
                </span>
              </div>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-xs overflow-x-auto">
              <Icon name="check_circle" className="text-secondary text-[18px] shrink-0" />
              <p className="font-label-md text-label-md text-on-surface-variant truncate">
                {result.summaryTags.join(' • ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Telemetry Metrics</h2>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              {result.zones.length} Zones Calibrated
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center text-secondary">
                  <Icon name="water_drop" className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-label-lg text-label-lg text-on-surface">Hydration &amp; Moisture</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Epidermal fluid retention</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm text-on-surface">{result.metrics.hydration.value}%</span>
                <span className="block font-label-sm text-label-sm text-secondary font-semibold">
                  {result.metrics.hydration.delta}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${result.metrics.hydration.value}%` }} />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-space-sm rounded-DEFAULT">
              {result.metrics.hydration.note}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between gap-space-sm">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                    <Icon name="shield" className="text-[18px]" />
                  </div>
                  <span className="font-label-sm text-label-sm font-bold uppercase text-secondary">
                    {result.metrics.barrier.status}
                  </span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface">Barrier Function</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">High resistance</p>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded-DEFAULT">
                <p className="font-label-sm text-label-sm text-on-secondary-container">{result.metrics.barrier.note}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between gap-space-sm">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary">
                    <Icon name="favorite" className="text-[18px]" />
                  </div>
                  <span className="font-label-sm text-label-sm font-bold uppercase text-secondary">
                    {result.metrics.redness.status}
                  </span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface">Redness</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Sensitivity: {result.metrics.redness.value}%
                </p>
              </div>
              <div className="bg-surface-container-low p-space-xs rounded-DEFAULT">
                <p className="font-label-sm text-label-sm text-secondary font-medium">{result.metrics.redness.note}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <Icon name="grain" className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-label-lg text-label-lg text-on-surface">Pore Micro-texture</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Follicular clarity ratio</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm text-on-surface">{result.metrics.smoothness.value}%</span>
                <span className="block font-label-sm text-label-sm text-secondary font-semibold">
                  {result.metrics.smoothness.status}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${result.metrics.smoothness.value}%` }} />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{result.metrics.smoothness.note}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <Icon name="science" className="text-primary text-[20px]" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface">AI Formulation Guide</h2>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-semibold">
              7-Day Plan
            </span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-space-xs">
              Recommended Hero Actives
            </span>
            <div className="flex flex-col gap-space-xs">
              {result.recommendedActives.map((active) => (
                <div key={active.name} className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-DEFAULT">
                  <div className="flex items-center gap-space-sm">
                    <Icon name={active.icon} className="text-secondary text-[20px]" />
                    <div>
                      <span className="font-label-lg text-label-lg text-on-surface block">{active.name}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{active.note}</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                    {active.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-error-container/40 p-space-sm rounded-DEFAULT flex items-start gap-space-sm">
            <Icon name="warning" className="text-error text-[20px] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-error-container font-semibold">
                {result.warning.title}
              </span>
              <span className="font-body-sm text-body-sm text-on-error-container mt-0.5">{result.warning.detail}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm mt-space-xs pb-space-xl">
          <button
            type="button"
            onClick={handleUpdateRoutine}
            className={`w-full h-[52px] rounded-full font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-all active:scale-[0.98] ${
              routineUpdated ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary shadow-sm'
            }`}
          >
            <Icon name={routineUpdated ? 'done' : 'checklist_rtl'} className="text-[20px]" />
            <span>{routineUpdated ? 'Routine Synchronized!' : 'Update Daily Routine with Recommendations'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="w-full h-[52px] bg-secondary-container/70 text-on-secondary-container rounded-full font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-transform active:scale-[0.98]"
          >
            <Icon name="forum" className="text-[20px]" />
            <span>Ask SkinAI Assistant About This Scan</span>
          </button>
          {!isSimulated && (
            <div className="w-full h-[44px] flex items-center justify-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
              <Icon name={result.photoStored ? 'bookmark_added' : 'info'} className="text-[18px]" />
              <span>
                {result.photoStored
                  ? `Photo saved to your Progress timeline · auto-deletes in ${result.photoRetentionDays} days`
                  : 'Score logged to Progress — photo wasn’t saved (you chose not to keep it)'}
              </span>
            </div>
          )}
        </div>
      </div>
    </StackLayout>
  );
}
