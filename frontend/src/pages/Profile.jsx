import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StackLayout from '../layouts/StackLayout.jsx';
import Icon from '../components/Icon.jsx';
import Avatar from '../components/Avatar.jsx';
import ToggleSwitch from '../components/ToggleSwitch.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteAccount, logout } from '../services/authService.js';
import { CURRENT_USER } from '../data/user.js';
import { PLANS, PRO_FEATURES, PRIMARY_CONCERNS, EXCLUSIONS } from '../data/subscription.js';

const SETTINGS_ROWS = [
  { icon: 'face_unlock', title: 'Biometric Photo Vault', note: 'Manage 24 stored dermal scans' },
  { icon: 'notifications_active', title: 'Notification Channels', note: 'UV index alerts & Routine cadence' },
  { icon: 'ios_share', title: 'Export Skin Summary (PDF)', note: 'Shareable PDF of your skin tracking history' },
];

export default function Profile() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { user, setUser } = useAuth();
  const [concerns, setConcerns] = useState(PRIMARY_CONCERNS);
  const [reminders, setReminders] = useState({ morning: true, evening: true });
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // cookie clears server-side regardless; proceed to the welcome screen either way
    } finally {
      setUser(null);
      setLoggingOut(false);
      navigate('/');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      setUser(null);
      showToast('Account and photos permanently deleted');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Could not delete account — please try again');
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const toggleConcern = (name) => {
    setConcerns((prev) =>
      prev.map((c) => {
        if (c.name !== name) return c;
        const nextActive = !c.active;
        showToast(nextActive ? `Prioritizing "${name}"` : `Removed "${name}" from concerns`);
        return { ...c, active: nextActive };
      })
    );
  };

  return (
    <StackLayout title="Profile & Subscription" backTo="/dashboard">
      <div className="flex flex-col w-full pb-10">
        <section className="px-margin pt-space-md">
          <div className="relative overflow-hidden bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-gradient-to-br from-primary-fixed/30 to-secondary-fixed/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-space-md relative z-10">
              <div className="relative shrink-0 ring-2 ring-surface-container-high shadow-sm rounded-full">
                <Avatar name={user?.name} size="w-16 h-16" textClass="font-headline-sm text-headline-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-space-xs">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">{user?.name || CURRENT_USER.fullName}</h2>
                  <button
                    type="button"
                    onClick={() => showToast('Profile editing enabled')}
                    className="flex items-center gap-1 bg-surface-container px-space-sm py-1 rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <Icon name="edit" className="text-[14px]" />
                    <span className="font-label-sm text-label-sm uppercase tracking-wider">Edit</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-secondary font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Skin Type: {CURRENT_USER.skinType}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 truncate">
                  {user?.email || 'Not signed in'} • Member since {CURRENT_USER.memberSince}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-space-xs mt-space-md pt-space-md bg-surface-container-low rounded-DEFAULT p-space-sm text-center">
              <div>
                <span className="block font-headline-sm text-headline-sm text-primary">{CURRENT_USER.barrierScore}%</span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant">Barrier Score</span>
              </div>
              <div className="border-x border-surface-container-highest/60">
                <span className="block font-headline-sm text-headline-sm text-secondary">{CURRENT_USER.scansCompleted}</span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant">Scans Done</span>
              </div>
              <div>
                <span className="block font-headline-sm text-headline-sm text-on-surface">Tier 1</span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant">Free Plan</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-margin mt-space-lg flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <Icon name="dermatology" className="text-secondary text-[20px]" />
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Skin Profile &amp; Preferences</h3>
            </div>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
              AI Synced
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-lg text-label-lg text-on-surface">Primary Skin Concerns</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Tap to adjust focus</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {concerns.map((chip) => (
                <button
                  key={chip.name}
                  type="button"
                  onClick={() => toggleConcern(chip.name)}
                  aria-pressed={chip.active}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    chip.active ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <Icon name={chip.active ? 'check_small' : 'add'} className="text-[16px]" />
                  <span className="font-label-md text-label-md">{chip.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-space-md pt-space-md">
              <span className="block font-label-lg text-label-lg text-on-surface mb-space-xs">Exclusions &amp; Allergies</span>
              <div className="flex flex-wrap gap-2">
                {EXCLUSIONS.map((excl) => (
                  <div key={excl.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                    <Icon name={excl.icon} className="text-[14px]" />
                    <span className="font-label-md text-label-md">{excl.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-space-md pt-space-md flex flex-col gap-space-sm bg-surface-container-low p-space-sm rounded-DEFAULT">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="wb_sunny" className="text-[18px]" />
                  </div>
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface block leading-tight">Morning Routine Pulse</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">Cleanser, Hyaluronic, SPF 50+</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-secondary font-semibold">07:30</span>
                  <ToggleSwitch
                    enabled={reminders.morning}
                    label="Morning routine reminder"
                    onChange={(v) => {
                      setReminders((r) => ({ ...r, morning: v }));
                      showToast(v ? 'Routine reminder scheduled' : 'Reminder muted');
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="bedtime" className="text-[18px]" />
                  </div>
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface block leading-tight">Evening Barrier Protocol</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">Double cleanse, Ceramide balm</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-secondary font-semibold">21:00</span>
                  <ToggleSwitch
                    enabled={reminders.evening}
                    label="Evening routine reminder"
                    onChange={(v) => {
                      setReminders((r) => ({ ...r, evening: v }));
                      showToast(v ? 'Routine reminder scheduled' : 'Reminder muted');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-margin mt-space-lg flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <Icon name="workspace_premium" className="text-primary text-[20px]" />
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Membership &amp; Intel</h3>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Premium</span>
          </div>

          <div className="relative overflow-hidden bg-surface-container-lowest rounded-lg p-space-md shadow-md bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-tertiary-fixed/40">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-on-primary mb-2">
                  <Icon name="auto_awesome" className="text-[14px]" />
                  <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase">SkinAI Pro</span>
                </div>
                <h4 className="font-headline-lg text-headline-lg text-on-surface">Deeper AI Skin Insights</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Unlock richer photo-based skin analysis &amp; cosmetic chemist formulation audits.
                </p>
              </div>
            </div>

            <div className="mt-space-md grid grid-cols-1 gap-2.5">
              {PRO_FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-center gap-space-sm bg-surface-container-low p-2 rounded-DEFAULT">
                  <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <Icon name={feature.icon} className="text-[16px]" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-label-md text-label-md text-on-surface font-semibold block leading-tight">{feature.title}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">{feature.note}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-space-md flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Select Your Protocol
              </span>
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <label
                    key={plan.id}
                    className={`flex items-center justify-between p-space-sm rounded-DEFAULT cursor-pointer transition-colors relative ${
                      isSelected ? 'bg-primary-fixed/40 ring-1 ring-primary/40' : 'bg-surface-container-low'
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-2.5 right-4 bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full shadow-sm">
                        {plan.highlight}
                      </span>
                    )}
                    <div className="flex items-center gap-space-sm">
                      <input
                        type="radio"
                        name="subscription_plan"
                        value={plan.id}
                        checked={isSelected}
                        onChange={() => setSelectedPlan(plan.id)}
                        className="w-4 h-4 text-primary focus:ring-0 accent-primary"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-label-lg text-label-lg ${isSelected ? 'text-on-primary-fixed-variant font-bold' : 'text-on-surface'}`}>
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                              {plan.badge}
                            </span>
                          )}
                          {plan.verified && <Icon name="verified" className="text-[14px] text-primary" />}
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{plan.note}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className={`font-label-lg text-label-lg font-semibold ${isSelected ? 'text-primary font-bold' : 'text-on-surface'}`}>
                          {plan.price}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{plan.period}</span>
                      </div>
                      {plan.billedNote && <span className="font-label-sm text-label-sm text-on-surface-variant block">{plan.billedNote}</span>}
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => showToast('Initiating 7-day Pro Free Trial...')}
              className="w-full mt-space-md py-3.5 px-space-md bg-primary-container text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <Icon name="lock_open" className="text-[20px]" />
              <span>Start 7-Day Free Trial</span>
            </button>
            <p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-2.5">
              Cancel anytime in 2 taps. Zero commitment during 7-day evaluation period.
            </p>
          </div>
        </section>

        <section className="px-margin mt-space-lg flex flex-col gap-space-md">
          <div className="flex items-center gap-space-xs">
            <Icon name="security" className="text-tertiary text-[20px]" />
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Privacy &amp; Security Shield</h3>
          </div>
          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex flex-col gap-1 mt-1">
              {SETTINGS_ROWS.map((row) => (
                <button
                  key={row.title}
                  type="button"
                  onClick={() => showToast(`Opening ${row.title}...`)}
                  className="w-full flex items-center justify-between py-space-sm px-2 rounded-DEFAULT hover:bg-surface-container-low transition-colors text-left"
                >
                  <div className="flex items-center gap-space-sm">
                    <Icon name={row.icon} className="text-on-surface-variant text-[20px]" />
                    <div>
                      <span className="font-label-lg text-label-lg text-on-surface block leading-tight">{row.title}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block">{row.note}</span>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-on-surface-variant text-[18px]" />
                </button>
              ))}
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="w-full flex items-center justify-between py-space-sm px-2 rounded-DEFAULT hover:bg-surface-container-low transition-colors text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-space-sm">
                  <Icon name="logout" className="text-on-surface-variant text-[20px]" />
                  <span className="font-label-lg text-label-lg text-on-surface block leading-tight">
                    {loggingOut ? 'Logging out...' : 'Log Out'}
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-space-md pt-space-sm border-t border-surface-container">
              {confirmingDelete ? (
                <div className="flex flex-col gap-space-sm p-space-sm rounded-DEFAULT bg-error-container/30">
                  <span className="font-label-md text-label-md text-on-error-container font-semibold">
                    Permanently delete your account &amp; any saved photos? This cannot be undone.
                  </span>
                  <div className="flex gap-space-sm">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => setConfirmingDelete(false)}
                      className="flex-1 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2 rounded-full bg-error text-on-error font-label-md text-label-md disabled:opacity-60"
                    >
                      {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="w-full flex items-center justify-between py-space-sm px-2 rounded-DEFAULT text-error hover:bg-error-container/30 transition-colors"
                >
                  <div className="flex items-center gap-space-sm">
                    <Icon name="delete_forever" className="text-[20px]" />
                    <span className="font-label-lg text-label-lg font-semibold">Purge Biometrics &amp; Delete Account</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-error bg-error-container px-2 py-0.5 rounded-full">
                    Permanent
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="px-margin mt-space-lg text-center">
          <p className="font-display-lg-mobile text-display-lg-mobile text-tertiary-container/80 italic">
            Quiet scientific precision.
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">SkinAI Engine v3.4.2</p>
        </div>
      </div>
    </StackLayout>
  );
}
