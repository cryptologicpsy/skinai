import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader.jsx';
import Icon from '../components/Icon.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { QUESTIONNAIRE_STEPS } from '../data/questionnaire.js';

export default function Questionnaire() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = QUESTIONNAIRE_STEPS[stepIndex];
  const isLast = stepIndex === QUESTIONNAIRE_STEPS.length - 1;
  const selected = answers[step.id] ?? (step.multi ? [] : null);
  const canContinue = step.multi ? selected.length > 0 : Boolean(selected);

  const toggleOption = (value) => {
    setAnswers((prev) => {
      if (!step.multi) {
        return { ...prev, [step.id]: value };
      }
      const current = prev[step.id] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [step.id]: next };
    });
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (isLast) {
      showToast('Skin profile created — welcome to SkinAI!');
      navigate('/dashboard');
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigate(-1);
      return;
    }
    setStepIndex((i) => i - 1);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen pb-safe">
      <AuthHeader title="Skin Profile" onBack={handleBack} />
      <main className="flex-1 flex flex-col w-full px-margin pt-space-md pb-space-xl">
        <div className="flex items-center gap-1.5 mb-space-lg">
          {QUESTIONNAIRE_STEPS.map((s, idx) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx <= stepIndex ? 'bg-primary-container' : 'bg-surface-container-high'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-space-xs mb-space-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center text-on-secondary-container">
            <Icon name={step.icon} className="text-[20px]" />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Step {stepIndex + 1} of {QUESTIONNAIRE_STEPS.length}
          </span>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-on-surface">{step.title}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 mb-space-lg">{step.subtitle}</p>

        <div className="flex flex-col gap-space-sm">
          {step.options.map((option) => {
            const isActive = step.multi ? selected.includes(option.value) : selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                aria-pressed={isActive}
                className={`w-full flex items-center justify-between gap-space-sm p-space-md rounded-lg border transition-all text-left ${
                  isActive
                    ? 'bg-primary-fixed/40 border-primary/40'
                    : 'bg-surface-container-lowest border-transparent shadow-sm hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <Icon name={option.icon} className="text-[18px]" />
                  </div>
                  <span className="font-label-lg text-label-lg text-on-surface">{option.label}</span>
                </div>
                <Icon
                  name={isActive ? 'check_circle' : 'radio_button_unchecked'}
                  className={`text-[20px] ${isActive ? 'text-primary' : 'text-outline-variant'}`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <button
          type="button"
          disabled={!canContinue}
          onClick={handleNext}
          className="w-full h-13 mt-space-xl rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{isLast ? 'Finish Setup' : 'Continue'}</span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </button>
      </main>
    </div>
  );
}
