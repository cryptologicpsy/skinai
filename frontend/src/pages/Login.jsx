import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthHeader from '../components/AuthHeader.jsx';
import FormField from '../components/FormField.jsx';
import Icon from '../components/Icon.jsx';
import { login } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_CREDENTIALS } from '../data/user.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login(form);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Could not log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-DEFAULT bg-surface-container-low border border-transparent focus:border-primary-container focus:outline-none pl-11 pr-4 py-3.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant transition-colors';

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen pb-safe">
      <AuthHeader title="Log In" />
      <main className="flex-1 flex flex-col w-full px-margin pt-space-lg pb-space-xl">
        <div className="mb-space-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Welcome back</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Log in to continue your skin journey.
          </p>
        </div>

        <div className="flex items-center justify-between gap-space-sm mb-space-lg p-space-sm rounded-DEFAULT bg-secondary-container/30 border border-dashed border-secondary/40">
          <div className="flex items-center gap-space-sm min-w-0">
            <Icon name="science" className="text-secondary text-[18px] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Demo account</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm(DEMO_CREDENTIALS);
              setErrors({});
              setFormError('');
            }}
            className="shrink-0 px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Use demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" noValidate>
          <FormField label="Email" id="login-email" error={errors.email}>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
              />
            </div>
          </FormField>

          <FormField label="Password" id="login-password" error={errors.password}>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${inputClass} pr-11`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          {formError && (
            <div className="flex items-center gap-2 bg-error-container/40 text-on-error-container px-space-md py-space-sm rounded-DEFAULT">
              <Icon name="error" className="text-[18px]" />
              <span className="font-label-md text-label-md">{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-13 mt-space-sm rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Icon name="progress_activity" className="text-[18px] animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <p className="text-center font-label-md text-label-md text-on-surface-variant mt-space-lg">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold underline decoration-primary/40 underline-offset-4">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
