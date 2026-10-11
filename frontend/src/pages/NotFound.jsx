import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-space-md px-margin text-center bg-surface">
      <Icon name="search_off" className="text-[40px] text-on-surface-variant" />
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Page not found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        That screen doesn&apos;t exist in SkinAI.
      </p>
      <Link
        to="/dashboard"
        className="px-space-lg py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
