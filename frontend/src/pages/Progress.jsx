import { useEffect, useState } from 'react';
import TabLayout from '../layouts/TabLayout.jsx';
import Icon from '../components/Icon.jsx';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';
import TrendChart from '../components/TrendChart.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getScanHistory } from '../services/skinAnalysisService.js';
import {
  SCORECARD,
  BEFORE_AFTER,
  HYDRATION_TREND,
  REDNESS_TREND,
  BARRIER_SCORE,
  WEEKLY_MILESTONES,
} from '../data/progress.js';

const RANGES = ['Week', 'Month', '3 Months', 'Year'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Progress() {
  const showToast = useToast();
  const [range, setRange] = useState('Month');
  const [realScans, setRealScans] = useState(null); // null = not loaded yet / unavailable

  useEffect(() => {
    getScanHistory().then(setRealScans);
  }, []);

  const hasRealScans = Array.isArray(realScans) && realScans.length > 0;

  // Weekly Milestones list: real scan history when available (any photo
  // state), otherwise the sample data.
  const milestones = hasRealScans
    ? realScans.map((s, i) => ({
        id: s.id,
        date: formatDate(s.date),
        score: s.score,
        note: s.note || s.headline,
        image: s.photoUrl,
        latest: i === 0,
      }))
    : WEEKLY_MILESTONES;

  // Before/After slider needs two REAL saved photos to be meaningful —
  // falls back to the sample comparison until the user has at least two.
  const scansWithPhotos = hasRealScans ? realScans.filter((s) => s.photoUrl) : [];
  const beforeAfter =
    scansWithPhotos.length >= 2
      ? {
          before: {
            label: formatDate(scansWithPhotos[scansWithPhotos.length - 1].date),
            metricLabel: `Score ${scansWithPhotos[scansWithPhotos.length - 1].score}`,
            image: scansWithPhotos[scansWithPhotos.length - 1].photoUrl,
          },
          after: {
            label: `${formatDate(scansWithPhotos[0].date)} (Latest)`,
            metricLabel: `Score ${scansWithPhotos[0].score}`,
            image: scansWithPhotos[0].photoUrl,
          },
        }
      : BEFORE_AFTER;
  const isSampleBeforeAfter = scansWithPhotos.length < 2;
  const isSampleMilestones = !hasRealScans;

  return (
    <TabLayout subtitle="Skin Progress">
      <div className="flex flex-col w-full pb-10 space-y-space-lg px-margin">
        <section className="flex flex-col space-y-space-sm pt-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-space-xs">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container">
                <Icon name="spa" className="text-[14px]" />
              </span>
              <span className="font-label-md text-label-md text-secondary tracking-wider uppercase">
                Dermal Evolution
              </span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Running AI audit on your latest scans...')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-label-md active:scale-95 transition-transform"
            >
              <Icon name="auto_fix_high" className="text-[16px] text-primary" />
              <span>AI Audit</span>
            </button>
          </div>
          <div className="flex flex-col">
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface tracking-tight leading-none">
              Your Skin Journey
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Objective longitudinal metrics backed by clinical reflectance imaging.
            </p>
          </div>
          <div className="flex items-center justify-between p-1 bg-surface-container rounded-full shadow-inner mt-space-xs">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRange(r);
                  showToast(`Showing ${r} view`);
                }}
                className={`flex-1 py-1.5 rounded-full text-center font-label-md text-label-md transition-all ${
                  range === r
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-secondary-container/30 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-primary-fixed/40 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-space-xs">
                <Icon name="verified" className="text-secondary text-[20px]" />
                <span className="font-headline-sm text-headline-sm text-on-surface">30-Day Synthesis</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">
                AI Synced
              </span>
            </div>
            <div className="grid grid-cols-3 gap-space-sm pt-space-xs">
              <div className="flex flex-col p-2.5 rounded-DEFAULT bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Barrier Recov.</span>
                <span className="font-headline-md text-headline-md text-secondary mt-1 font-semibold">
                  {SCORECARD.barrierRecovery}
                </span>
                <span className="font-label-sm text-[9px] text-secondary font-medium flex items-center mt-0.5">
                  <Icon name="arrow_upward" className="text-[10px]" /> Healthy Stratum
                </span>
              </div>
              <div className="flex flex-col p-2.5 rounded-DEFAULT bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Redness Δ</span>
                <span className="font-headline-md text-headline-md text-primary mt-1 font-semibold">
                  {SCORECARD.rednessDelta}
                </span>
                <span className="font-label-sm text-[9px] text-primary font-medium flex items-center mt-0.5">
                  <Icon name="arrow_downward" className="text-[10px]" /> Redness Drop
                </span>
              </div>
              <div className="flex flex-col p-2.5 rounded-DEFAULT bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Routine Log</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 font-semibold">
                  {SCORECARD.routineLogDone}
                  <span className="text-xs font-normal text-on-surface-variant">/{SCORECARD.routineLogTotal}</span>
                </span>
                <span className="font-label-sm text-[9px] text-on-surface-variant font-medium mt-0.5">
                  {Math.round((SCORECARD.routineLogDone / SCORECARD.routineLogTotal) * 100)}% Discipline
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">Micro-Dermal Comparison</span>
              <Icon name="biotech" className="text-primary text-[18px]" />
            </div>
            {isSampleBeforeAfter ? (
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                Sample Preview
              </span>
            ) : (
              <span className="font-label-sm text-label-sm text-on-surface-variant">Cheek Z-Stack 2.4x</span>
            )}
          </div>
          <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col space-y-space-sm">
            <BeforeAfterSlider before={beforeAfter.before} after={beforeAfter.after} />
            {isSampleBeforeAfter && (
              <p className="px-space-xs font-body-sm text-body-sm text-on-surface-variant">
                These are sample photos, not yours. Save at least 2 scans (toggle "Save this photo?" on the Skin
                Analysis screen) to see your own before/after here.
              </p>
            )}
            <div className="flex items-center justify-between px-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center space-x-1.5">
                <Icon name="touch_app" className="text-[15px] text-tertiary" />
                <span>Drag separator horizontally to compare</span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Zoomed in 5x')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container"
              >
                <Icon name="zoom_in" className="text-[14px]" />
                <span>Inspect 5x</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Skin Metrics Trend</h2>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/60 px-2.5 py-0.5 rounded-full">
              Synchronized
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-space-xs">
                <div className="w-8 h-8 rounded-full bg-secondary-container/60 flex items-center justify-center text-secondary">
                  <Icon name="water_drop" className="text-[18px]" />
                </div>
                <div>
                  <div className="font-label-lg text-label-lg text-on-surface">Hydration Index</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Epidermal moisture capacity</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-headline-sm text-headline-sm text-secondary">{HYDRATION_TREND.current}</div>
                <div className="font-label-sm text-label-sm text-secondary font-medium">{HYDRATION_TREND.delta}</div>
              </div>
            </div>
            <TrendChart trend={HYDRATION_TREND} gradientId="hydrationFill" />
            <div className="flex justify-between font-label-sm text-[11px] text-on-surface-variant px-1 pt-1">
              {HYDRATION_TREND.labels.map((label, idx) => (
                <span key={label} className={idx === HYDRATION_TREND.labels.length - 1 ? 'font-bold text-secondary' : ''}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-space-xs">
                <div className="w-8 h-8 rounded-full bg-primary-fixed/50 flex items-center justify-center text-primary">
                  <Icon name="grain" className="text-[18px]" />
                </div>
                <div>
                  <div className="font-label-lg text-label-lg text-on-surface">Redness &amp; Sensitivity</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Visible redness over time</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-headline-sm text-headline-sm text-primary">{REDNESS_TREND.current}</div>
                <div className="font-label-sm text-label-sm text-primary font-medium">{REDNESS_TREND.delta}</div>
              </div>
            </div>
            <TrendChart trend={REDNESS_TREND} gradientId="rednessFill" />
            <div className="flex justify-between font-label-sm text-[11px] text-on-surface-variant px-1 pt-1">
              {REDNESS_TREND.labels.map((label, idx) => (
                <span key={label} className={idx === REDNESS_TREND.labels.length - 1 ? 'font-bold text-primary' : ''}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-space-xs">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                  <Icon name="shield" className="text-[18px]" />
                </div>
                <div>
                  <div className="font-label-lg text-label-lg text-on-surface">Barrier Strength Score</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Estimated from your photo trends</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold">
                Optimal Defense
              </span>
            </div>
            <div className="pt-2 space-y-1.5">
              <div className="w-full h-3 rounded-full bg-surface-container flex overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${BARRIER_SCORE.percent}%` }} />
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-0.5">
                <span>{BARRIER_SCORE.baseline}</span>
                <span className="font-semibold text-secondary">{BARRIER_SCORE.current}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Weekly Milestones</h2>
              {isSampleMilestones && (
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                  Sample Preview
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => showToast('Opening full scan history')}
              className="font-label-md text-label-md text-primary font-medium hover:underline"
            >
              View All Scans
            </button>
          </div>
          <div className="space-y-space-sm">
            {milestones.map((entry) => (
              <div key={entry.id} className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center space-x-space-md">
                <div className="relative w-14 h-14 rounded-DEFAULT overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                  {entry.image ? (
                    <img className="w-full h-full object-cover" alt={entry.date} src={entry.image} />
                  ) : (
                    <Icon name="no_photography" className="text-[20px] text-outline-variant" />
                  )}
                  {entry.latest && (
                    <span className="absolute bottom-0 inset-x-0 bg-secondary/80 text-on-secondary text-[8px] font-bold text-center py-0.5 uppercase">
                      Latest
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">{entry.date}</span>
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${
                        entry.latest || entry.score >= 85
                          ? 'text-secondary bg-secondary-container/40'
                          : 'text-on-surface-variant bg-surface-container'
                      }`}
                    >
                      Score {entry.score}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-space-xs pb-space-lg flex flex-col space-y-space-sm">
          <button
            type="button"
            onClick={() => showToast('Preparing your PDF report...')}
            className="w-full h-[52px] rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <Icon name="ios_share" className="text-[20px]" />
            <span>Export Clinical Derm Report (PDF)</span>
          </button>
          <p className="text-center font-label-sm text-label-sm text-on-surface-variant">
            Includes calibrated spectral scans, full timeline, and ingredient history.
          </p>
        </section>
      </div>
    </TabLayout>
  );
}
