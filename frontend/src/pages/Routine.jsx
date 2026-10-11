import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabLayout from '../layouts/TabLayout.jsx';
import Icon from '../components/Icon.jsx';
import CircularGauge from '../components/CircularGauge.jsx';
import { useRoutine } from '../context/RoutineContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Routine() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { am, pm, toggleStep, amProgress, pmProgress } = useRoutine();
  const [period, setPeriod] = useState('am');

  const steps = period === 'am' ? am : pm;
  const progress = period === 'am' ? amProgress : pmProgress;
  const firstPendingId = steps.find((s) => !s.completedAt)?.id;

  return (
    <TabLayout subtitle="Daily Routine">
      <div className="flex flex-col w-full px-margin pb-space-xl">
        <div className="relative overflow-hidden rounded-lg bg-surface-container-low p-space-md shadow-sm mb-space-md">
          <div className="flex items-start justify-between gap-space-sm mb-space-xs">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Your AI Routine Plan
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Your Personalized Routine</h2>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container">
              <Icon name="eco" className="text-[14px]" />
              <span className="font-label-sm text-label-sm font-semibold">AI Curated</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
            <Icon name="tune" className="text-[16px] text-secondary" />
            4-Step Regimen • Tailored for Combination &amp; Dehydrated Skin
          </p>
          <div className="mt-space-md pt-space-sm bg-surface-container-lowest/60 backdrop-blur-md rounded-DEFAULT p-space-sm flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <CircularGauge percent={progress.percent} size="w-9 h-9" strokeWidth={3.2}>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  {progress.done}/{progress.total}
                </span>
              </CircularGauge>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {period === 'am' ? 'Morning' : 'Evening'} Ritual {progress.percent}% Complete
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {progress.done > 0 ? `${progress.done} step${progress.done > 1 ? 's' : ''} logged` : 'No steps logged yet'}
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Updated today</span>
          </div>
        </div>

        <div className="bg-surface-container-high p-1 rounded-full flex items-center gap-1 mb-space-lg select-none shadow-inner" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={period === 'am'}
            onClick={() => setPeriod('am')}
            className={`flex-1 flex items-center justify-center gap-space-xs py-2.5 rounded-full transition-all duration-200 ${
              period === 'am' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="light_mode" className="text-[18px] text-primary" filled={period === 'am'} />
            <span className="font-label-md text-label-md font-semibold">Morning Routine (AM)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={period === 'pm'}
            onClick={() => setPeriod('pm')}
            className={`flex-1 flex items-center justify-center gap-space-xs py-2.5 rounded-full transition-all duration-200 ${
              period === 'pm' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="dark_mode" className="text-[18px]" filled={period === 'pm'} />
            <span className="font-label-md text-label-md font-semibold">Evening Routine (PM)</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-md">
          {steps.map((step) => {
            const done = Boolean(step.completedAt);
            const isNext = step.id === firstPendingId;
            const accentColor = done ? 'bg-secondary' : isNext ? 'bg-primary-container' : 'bg-outline-variant';
            return (
              <div
                key={step.id}
                className="relative bg-surface-container-lowest rounded-lg p-space-md shadow-sm transition-all overflow-hidden group"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`} />
                <div className="flex items-start justify-between gap-space-sm pl-space-xs mb-space-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          done
                            ? 'bg-secondary-container text-on-secondary-container'
                            : isNext
                              ? 'bg-primary-fixed text-on-primary-fixed-variant'
                              : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        Step 0{step.order} • {step.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{step.title}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-DEFAULT bg-surface-container-low flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
                    {step.image ? (
                      <img className="w-full h-full object-cover" alt={step.title} src={step.image} />
                    ) : (
                      <Icon name={step.meta.icon} className="text-[22px] text-secondary" />
                    )}
                  </div>
                </div>
                <p className="pl-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                  {step.description}
                </p>
                <div className="pl-space-xs flex items-center justify-between pt-space-xs">
                  <div className={`flex items-center gap-1.5 ${done ? 'text-secondary' : isNext ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <Icon name={step.meta.icon} className="text-[16px]" />
                    <span className="font-label-sm text-label-sm font-medium">{step.meta.label}</span>
                  </div>
                  <button
                    type="button"
                    aria-pressed={done}
                    onClick={() => toggleStep(period, step.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                      done
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-primary text-on-primary shadow-sm'
                    }`}
                  >
                    <Icon name={done ? 'check_circle' : 'radio_button_unchecked'} className="text-[16px]" />
                    <span>{done ? `Done • ${step.completedAt}` : 'Mark as Complete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-space-lg rounded-lg bg-surface-container p-space-md flex gap-space-sm items-start">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-on-secondary-container">
            <Icon name="tips_and_updates" className="text-[20px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Application Tip</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Apply Step 2 while facial epidermis is still slightly damp from cleansing. This draws maximum
              atmospheric moisture into the Stratum Corneum.
            </p>
          </div>
        </div>

        <div className="mt-space-lg flex flex-col gap-space-sm">
          <button
            type="button"
            onClick={() => showToast('Custom product flow coming soon')}
            className="w-full h-13 py-3.5 px-space-md rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-between shadow-sm active:bg-surface-container transition-all"
          >
            <div className="flex items-center gap-space-sm">
              <Icon name="add_circle" className="text-primary text-[22px]" />
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                Add Custom Product to {period.toUpperCase()}
              </span>
            </div>
            <Icon name="chevron_right" className="text-outline text-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="w-full h-13 py-3.5 px-space-md rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-between shadow-sm active:opacity-90 transition-all"
          >
            <div className="flex items-center gap-space-sm">
              <Icon name="auto_awesome" className="text-[22px]" />
              <span className="font-label-lg text-label-lg font-semibold">Ask AI to Adjust Routine Steps</span>
            </div>
            <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>
      </div>
    </TabLayout>
  );
}
