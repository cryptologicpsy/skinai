import { useNavigate } from 'react-router-dom';
import DemoBanner from './DemoBanner.jsx';
import Icon from './Icon.jsx';
import Avatar from './Avatar.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SKINAI_LOGO } from '../data/user.js';

export default function TabHeader({ subtitle }) {
  const navigate = useNavigate();
  const showToast = useToast();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <DemoBanner />
      <div className="h-20 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <img alt="SkinAI Logo" className="h-8 w-auto object-contain" src={SKINAI_LOGO} />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">SkinAI</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            aria-label="Notifications"
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
            onClick={() => showToast("You're all caught up — no new notifications")}
          >
            <Icon name="notifications" className="text-[22px]" />
          </button>
          <button
            type="button"
            aria-label="Open profile"
            className="relative flex items-center justify-center p-[2px] rounded-full bg-secondary-container/50 focus:outline-none"
            onClick={() => navigate('/profile')}
          >
            <Avatar name={user?.name} size="w-8 h-8" textClass="font-label-sm text-label-sm" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface" />
          </button>
        </div>
      </div>
    </header>
  );
}
