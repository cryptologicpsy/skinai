import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthHeader from '../components/AuthHeader.jsx';
import FormField from '../components/FormField.jsx';
import Icon from '../components/Icon.jsx';
import { signup } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', acceptedTerms: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    if (!form.acceptedTerms) next.acceptedTerms = 'You must accept the demo terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await signup(form);
      setUser(user);
      navigate('/questionnaire');
    } catch (err) {
      setFormError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-DEFAULT bg-surface-container-low border border-transparent focus:border-primary-container focus:outline-none pl-11 pr-4 py-3.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant transition-colors';

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen pb-safe">
      <AuthHeader title="Create Account" />
      <main className="flex-1 flex flex-col w-full px-margin pt-space-lg pb-space-xl">
        <div className="mb-space-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Start your skin journey</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            AI-powered skin insights, tailored to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" noValidate>
          <FormField label="Full name" id="signup-name" error={errors.name}>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Elena Rostova"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={Boolean(errors.name)}
              />
            </div>
          </FormField>

          <FormField label="Email" id="signup-email" error={errors.email}>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="signup-email"
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

          <FormField label="Password" id="signup-password" error={errors.password}>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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

          <FormField label="Confirm password" id="signup-confirm" error={errors.confirmPassword}>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className={inputClass}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
            </div>
          </FormField>

          <div className="flex flex-col gap-1.5 bg-surface-container-low rounded-DEFAULT p-space-md">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 accent-primary shrink-0"
                checked={form.acceptedTerms}
                onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
                aria-invalid={Boolean(errors.acceptedTerms)}
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                I understand <strong className="text-on-surface">this is a demo/test application</strong>, not a
                finished commercial product. My data (email, chat messages, skin analysis results) is stored only
                for testing purposes and may be reset at any time. I am not relying on it for real medical or
                dermatological advice. If I upload a photo, it will only be saved if I separately opt in at the
                time of the scan, and any saved photo is automatically deleted after a few days.
              </span>
            </label>
            {errors.acceptedTerms && (
              <span role="alert" className="font-label-sm text-label-sm text-error px-1">
                {errors.acceptedTerms}
              </span>
            )}
          </div>

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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="text-center font-label-md text-label-md text-on-surface-variant mt-space-lg">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold underline decoration-primary/40 underline-offset-4">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
