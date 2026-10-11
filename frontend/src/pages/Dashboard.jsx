import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabLayout from '../layouts/TabLayout.jsx';
import Icon from '../components/Icon.jsx';
import CircularGauge from '../components/CircularGauge.jsx';
import { useRoutine } from '../context/RoutineContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { MOCK_ANALYSIS_RESULT } from '../data/analysis.js';

const WEATHER = { uvIndex: 4, uvLabel: 'Mod', humidity: 58, aqi: 'Good' };

const PRODUCT_OF_THE_DAY = {
  name: 'Barrier Pure Mineral Shield',
  note: 'Zinc Oxide 18% with Centella Asiatica',
  image:
    '/images/img-73ef47d3aa.webp',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { user } = useAuth();
  const { am, pm, toggleStep, amProgress, pmProgress } = useRoutine();
  const [period, setPeriod] = useState('am');
  const [favorited, setFavorited] = useState(false);
  const firstName = user?.name?.split(' ')[0] || 'there';

  const steps = period === 'am' ? am : pm;
  const progress = period === 'am' ? amProgress : pmProgress;

  return (
    <TabLayout subtitle="Dashboard">
      <div className="flex flex-col w-full px-margin pb-space-xl gap-space-lg select-none">
        <section className="flex flex-col gap-space-xs mt-space-xs">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Good morning, {firstName} 👋
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <Icon name="wb_sunny" className="text-[16px] text-secondary" />
                <span>UV Index: {WEATHER.uvIndex} ({WEATHER.uvLabel})</span>
                <span className="text-outline-variant">•</span>
                <Icon name="humidity_mid" className="text-[16px] text-secondary" />
                <span>{WEATHER.humidity}%</span>
                <span className="text-outline-variant">•</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
                  AQI {WEATHER.aqi}
                </span>
              </p>
            </div>
            <button
              type="button"
              aria-label="Alerts"
              onClick={() => showToast('SPF reminder set for 1:00 PM')}
              className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Icon name="notifications_active" className="text-[24px]" />
            </button>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-lg bg-surface-container-lowest p-space-lg shadow-xl shadow-surface-tint/5">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-44 h-44 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant font-label-md text-label-md rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Daily Skin Check-in due
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <Icon name="schedule" className="text-[14px]" />
                ~10 sec
              </span>
            </div>
            <div className="flex items-start justify-between gap-space-md">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                  Let&apos;s understand your skin today
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                  AI calculates cellular hydration, dermal redness, and radiance in real-time.
                </p>
              </div>
              <div className="w-16 h-16 shrink-0 rounded-DEFAULT bg-surface-container-low flex items-center justify-center p-1.5 shadow-sm overflow-hidden">
                <img
                  alt="Serum bottle beside blush peony petals"
                  className="w-full h-full object-cover rounded-DEFAULT"
                  src="/images/img-81d2d22ef6.webp"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/analysis')}
              className="w-full h-13 py-3 px-space-lg rounded-full bg-primary-container hover:bg-primary transition-all duration-300 text-on-primary shadow-lg shadow-primary-container/30 flex items-center justify-center gap-2 font-label-lg text-label-lg tracking-wide group active:scale-[0.98]"
            >
              <Icon name="photo_camera" className="text-[20px] group-hover:rotate-12 transition-transform duration-300" />
              <span>Analyze My Skin</span>
              <Icon name="auto_awesome" className="text-[18px] text-on-primary/90" />
            </button>
            <p className="font-body-sm text-body-sm text-on-surface-variant/90 text-center">
              Takes ~10 seconds. AI calculates current barrier moisture &amp; radiance score.
            </p>
          </div>
        </section>

        <section className="rounded-DEFAULT bg-secondary-container/40 p-space-md flex items-start gap-space-sm shadow-sm">
          <div className="w-9 h-9 shrink-0 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
            <Icon name="spa" className="text-[20px]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md text-secondary font-bold">Sage Advice</span>
              <span className="font-label-sm text-label-sm text-on-secondary-container">1:00 PM SPF Alert</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-secondary-container">
              Increased outdoor UV anticipated this afternoon. Don&apos;t forget your mineral SPF reapplication
              around 1:00 PM for optimal dermal protection.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Latest Skin Analysis</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Captured {MOCK_ANALYSIS_RESULT.capturedAt}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/analysis/results')}
              className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant flex items-center gap-0.5 transition-colors"
            >
              Full Dossier
              <Icon name="chevron_right" className="text-[16px]" />
            </button>
          </div>

          <div className="rounded-lg bg-surface-container-lowest p-space-md shadow-md flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <CircularGauge percent={MOCK_ANALYSIS_RESULT.overallScore}>
                <span className="font-display-lg-mobile text-display-lg-mobile leading-none text-on-surface">
                  {MOCK_ANALYSIS_RESULT.overallScore}
                </span>
              </CircularGauge>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                  Skin Health Index
                </span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Radiance &amp; Balance</h4>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Firm barrier • Low irritation
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <Icon name="trending_up" className="text-[20px]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-space-sm">
            <MiniMetric icon="water_drop" iconColor="text-secondary" delta="+4%" deltaColor="text-secondary" value="78%" label="Hydration" barColor="bg-secondary" barWidth={78} />
            <MiniMetric icon="grain" iconColor="text-tertiary" delta="Fine" deltaColor="text-tertiary" value="88%" label="Pores & Smooth" barColor="bg-tertiary" barWidth={88} />
            <MiniMetric icon="blur_on" iconColor="text-primary" delta="Calm" deltaColor="text-primary" value="14%" label="Redness" barColor="bg-primary-container" barWidth={14} />
          </div>
        </section>

        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Your Daily Routine</h3>
            <span className="font-label-md text-label-md text-secondary bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full font-semibold">
              {progress.percent}% Complete
            </span>
          </div>

          <div className="flex p-1 bg-surface-container-high rounded-full w-full">
            <button
              type="button"
              onClick={() => setPeriod('am')}
              className={`flex-1 py-1.5 px-3 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-1.5 ${
                period === 'am' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon name="light_mode" className="text-[16px] text-secondary" filled={period === 'am'} />
              <span>Morning ({amProgress.done}/{amProgress.total} Done)</span>
            </button>
            <button
              type="button"
              onClick={() => setPeriod('pm')}
              className={`flex-1 py-1.5 px-3 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-1.5 ${
                period === 'pm' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon name="dark_mode" className="text-[16px]" />
              <span>Evening ({pmProgress.done}/{pmProgress.total} Done)</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            {steps.map((step) => {
              const done = Boolean(step.completedAt);
              return (
                <div
                  key={step.id}
                  className={`group flex items-center justify-between p-space-md rounded-DEFAULT bg-surface-container-lowest transition-all ${
                    done ? 'shadow-xs' : 'shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-space-md">
                    <button
                      type="button"
                      aria-pressed={done}
                      aria-label={`Mark ${step.title} as ${done ? 'incomplete' : 'complete'}`}
                      onClick={() => toggleStep(period, step.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                        done
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-high text-outline hover:bg-secondary-container hover:text-on-secondary-container'
                      }`}
                    >
                      <Icon name={done ? 'check' : 'circle'} className="text-[18px]" />
                    </button>
                    <div className="flex flex-col">
                      <span className={`font-body-md text-body-md text-on-surface ${done ? 'line-through opacity-70' : 'font-semibold'}`}>
                        {step.title}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Step {step.order} • {step.tag}
                      </span>
                    </div>
                  </div>
                  <Icon name={step.meta.icon} className="text-outline-variant text-[20px]" />
                </div>
              );
            })}
          </div>

          <div className="rounded-DEFAULT bg-surface-container-low p-space-md flex items-center gap-space-md mt-space-xs">
            <div className="w-14 h-14 rounded-DEFAULT bg-surface-container-lowest shrink-0 overflow-hidden shadow-xs">
              <img className="w-full h-full object-cover" alt="Mineral sunscreen pump bottle" src={PRODUCT_OF_THE_DAY.image} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                  Product of the Day
                </span>
                <Icon name="verified" className="text-[14px] text-secondary" />
              </div>
              <span className="font-body-md text-body-md text-on-surface font-semibold truncate">
                {PRODUCT_OF_THE_DAY.name}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {PRODUCT_OF_THE_DAY.note}
              </span>
            </div>
            <button
              type="button"
              aria-pressed={favorited}
              aria-label="Save product to favorites"
              onClick={() => {
                setFavorited((v) => !v);
                showToast(favorited ? 'Removed from favorites' : 'Saved to favorites');
              }}
              className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all"
            >
              <Icon name="favorite" filled={favorited} className={`text-[18px] ${favorited ? 'text-primary' : ''}`} />
            </button>
          </div>
        </section>
      </div>
    </TabLayout>
  );
}

function MiniMetric({ icon, iconColor, delta, deltaColor, value, label, barColor, barWidth }) {
  return (
    <div className="rounded-DEFAULT bg-surface-container-lowest p-space-sm flex flex-col justify-between shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <Icon name={icon} className={`text-[18px] ${iconColor}`} />
        <span className={`font-label-sm text-label-sm font-bold ${deltaColor}`}>{delta}</span>
      </div>
      <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">{value}</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{label}</span>
      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-1.5">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
