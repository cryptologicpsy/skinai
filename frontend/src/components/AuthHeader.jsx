import { useNavigate } from 'react-router-dom';
import DemoBanner from './DemoBanner.jsx';
import Icon from './Icon.jsx';

export default function AuthHeader({ title, backTo = '/', onBack }) {
  const navigate = useNavigate();
  return (
    <header className="w-full bg-surface pt-safe">
      <DemoBanner />
      <div className="h-16 px-margin flex items-center justify-between">
        <button
          type="button"
          aria-label="Go back"
          className="w-11 h-11 flex items-center justify-center text-on-surface rounded-full transition-colors hover:bg-surface-container"
          onClick={() => (onBack ? onBack() : navigate(backTo))}
        >
          <Icon name="arrow_back" className="text-[24px]" />
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">{title}</h1>
        <div className="w-11 h-11" />
      </div>
    </header>
  );
}
