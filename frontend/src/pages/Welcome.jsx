import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import DemoBanner from '../components/DemoBanner.jsx';
import { SKINAI_LOGO } from '../data/user.js';

const VALUE_PROPS = [
  {
    icon: 'biotech',
    bg: 'bg-primary-fixed',
    color: 'text-primary',
    title: 'AI-Powered Skin Analysis',
    subtitle: 'Visual insights into texture, tone & hydration from a photo',
  },
  {
    icon: 'science',
    bg: 'bg-secondary-fixed',
    color: 'text-secondary',
    title: 'Customized Formulations',
    subtitle: 'Adaptive ingredient pairing curated for your barrier',
  },
  {
    icon: 'security',
    bg: 'bg-tertiary-fixed',
    color: 'text-tertiary',
    title: 'Privacy by Design',
    subtitle: 'Your photos are only ever used to generate your results',
  },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen pb-safe">
      <DemoBanner />
      <main className="flex-1 flex flex-col relative w-full bg-surface pt-safe">
        <div className="flex flex-col w-full px-margin pb-space-xl">
          <div className="relative w-full overflow-hidden flex flex-col items-center">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-48 -right-16 w-56 h-56 rounded-full bg-secondary-container/50 blur-3xl pointer-events-none -z-10" />

            <div className="flex items-center gap-space-xs px-space-md py-1 bg-surface-container-low shadow-sm rounded-full mb-space-lg">
              <Icon name="spa" className="text-secondary text-[16px]" filled />
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                Next-Gen Beauty Intelligence
              </span>
            </div>

            <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center p-space-lg mb-space-lg">
              <div className="absolute inset-2 rounded-lg bg-gradient-to-tr from-surface-container-low via-surface-container-lowest to-tertiary-fixed/30 -z-10" />
              <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-surface-container-low/80 p-3 shadow-inner">
                <img alt="SkinAI Logo" className="w-full h-full object-contain filter drop-shadow-sm" src={SKINAI_LOGO} />
                <div className="absolute inset-0 rounded-full border border-primary/10 pointer-events-none" />
              </div>
            </div>

            <div className="w-full text-center space-y-space-sm mb-space-lg">
              <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface tracking-tight">
                Your skin. Your routine. <br />
                <span className="italic font-display-lg-mobile text-primary">Your confidence.</span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px] mx-auto px-space-xs">
                Unlock AI-powered facial skin insights. Explore hydration, barrier strength, and pore texture
                from a single selfie.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5 mb-space-xl">
              {VALUE_PROPS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 p-3 rounded-DEFAULT bg-surface-container-lowest shadow-sm"
                >
                  <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={item.icon} className={`${item.color} text-[20px]`} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-label-lg text-on-surface">{item.title}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full flex flex-col items-center gap-space-md">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full py-4 px-space-lg rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-label-md text-label-md text-primary underline decoration-primary/40 underline-offset-4 py-1 hover:text-on-primary-container transition-colors"
              >
                I already have an account
              </button>
            </div>

            <div className="mt-space-lg pt-space-xs flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-outline">
                <Icon name="info" className="text-[14px]" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Non-Diagnostic Cosmetic Evaluation
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-outline mt-0.5">Not a substitute for professional dermatological care</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
