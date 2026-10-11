import { useNavigate } from 'react-router-dom';
import DemoBanner from './DemoBanner.jsx';
import Icon from './Icon.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function StackHeader({ title, backTo }) {
  const navigate = useNavigate();
  const showToast = useToast();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <DemoBanner />
      <div className="h-16 px-margin flex items-center justify-between">
        <button
          type="button"
          aria-label="Go back"
          className="w-11 h-11 flex items-center justify-center text-on-surface rounded-full transition-colors hover:bg-surface-container"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        >
          <Icon name="arrow_back" className="text-[24px]" />
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">{title}</h1>
        <button
          type="button"
          aria-label="More options"
          className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
          onClick={() => showToast('More options coming soon')}
        >
          <Icon name="more_vert" className="text-[22px]" />
        </button>
      </div>
    </header>
  );
}
