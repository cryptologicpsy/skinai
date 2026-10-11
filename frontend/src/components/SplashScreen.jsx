import { SKINAI_LOGO } from '../data/user.js';

// Shown only for the brief moment AuthContext takes to resolve
// /api/auth/me on first load — prevents every logged-in-user-dependent bit
// of UI (avatar initials, first name, etc.) from flashing a wrong/placeholder
// value before snapping to the real one.
export default function SplashScreen() {
  return (
    <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-space-md">
      <img alt="SkinAI" className="h-10 w-auto object-contain" src={SKINAI_LOGO} />
      <div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
