import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/analysis', label: 'Analysis', icon: 'photo_camera' },
  { to: '/routine', label: 'Routine', icon: 'calendar_today' },
  { to: '/progress', label: 'Progress', icon: 'insights' },
  { to: '/chat', label: 'Chat', icon: 'forum' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around h-20 px-space-xs">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-space-xs min-w-[56px] min-h-[48px] py-1 select-none"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex items-center justify-center w-14 h-8 rounded-full transition-all duration-200 ${
                    isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  <Icon name={item.icon} className="text-[22px]" />
                </div>
                <span
                  className={`font-label-sm text-label-sm ${
                    isActive ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
