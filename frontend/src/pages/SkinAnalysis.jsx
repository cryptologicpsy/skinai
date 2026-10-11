import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabLayout from '../layouts/TabLayout.jsx';
import Icon from '../components/Icon.jsx';
import ToggleSwitch from '../components/ToggleSwitch.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { analyzeSkinPhoto } from '../services/skinAnalysisService.js';
import { SKIN_SCAN_PLACEHOLDER } from '../data/analysis.js';

const PHOTO_RETENTION_DAYS = import.meta.env.VITE_PHOTO_RETENTION_DAYS || 7;

const TIPS = [
  { icon: 'visibility_off', color: 'text-primary', label: 'Remove glasses' },
  { icon: 'sentiment_calm', color: 'text-primary', label: 'Relax expression' },
  { icon: 'light_mode', color: 'text-secondary', label: 'Natural light' },
];

export default function SkinAnalysis() {
  const navigate = useNavigate();
  const showToast = useToast();
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(SKIN_SCAN_PLACEHOLDER);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lensFront, setLensFront] = useState(true); // front/selfie camera by default
  const [storeConsent, setStoreConsent] = useState(false); // opt-in, off by default

  const hasRealPhoto = previewImage !== SKIN_SCAN_PLACEHOLDER;

  const handleGalleryChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    showToast('Photo loaded from gallery');
  };

  const handleCameraChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    showToast('Photo captured');
  };

  const handleAnalyze = () => {
    if (isAnalyzing || !hasRealPhoto) return;
    setIsAnalyzing(true);
    analyzeSkinPhoto(previewImage, storeConsent).then((result) => {
      navigate('/analysis/results', { state: { result, photo: previewImage } });
    });
  };

  return (
    <TabLayout subtitle="Skin Analysis">
      <div className="px-margin flex flex-col gap-space-lg pb-space-xl">
        <section className="flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-space-xs self-start px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container">
            <Icon name="auto_awesome" className="text-[14px]" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              AI Skin Scan Engine
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">AI Skin Scan</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Align your face in natural lighting for accurate skin telemetry and barrier assessment.
          </p>
        </section>

        <section className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container-highest flex items-center justify-center select-none group">
          <img
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
            alt="Live camera preview"
            src={previewImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-inverse-surface/30 pointer-events-none" />

          <div className="absolute top-space-md inset-x-space-md flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/85 backdrop-blur-md shadow-sm transition-all duration-300">
              {isAnalyzing ? (
                <>
                  <Icon name="sync" className="text-[14px] text-secondary animate-spin" />
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    Capturing Telemetry...
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
                    Lighting: Optimal
                    <Icon name="wb_sunny" className="text-[14px] text-amber-500" filled />
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              aria-label="Switch camera lens"
              onClick={() => {
                setLensFront((v) => !v);
                showToast(lensFront ? 'Switched to rear lens' : 'Switched to front lens');
              }}
              className="w-9 h-9 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-on-surface flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <Icon name="flip_camera_ios" className="text-[18px]" />
            </button>
          </div>

          <div className="relative w-[72%] h-[74%] flex items-center justify-center pointer-events-none z-10">
            <svg className="w-full h-full text-surface-container-lowest/80 drop-shadow-sm" fill="none" viewBox="0 0 240 320">
              <ellipse cx="120" cy="160" rx="108" ry="144" stroke="currentColor" strokeDasharray="6 6" strokeOpacity="0.6" strokeWidth="1.5" />
              <ellipse cx="120" cy="160" rx="96" ry="130" stroke="currentColor" strokeOpacity="0.9" strokeWidth="2" />
              <path d="M 40 100 A 30 30 0 0 1 70 70" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              <path d="M 200 100 A 30 30 0 0 0 170 70" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              <path d="M 40 220 A 30 30 0 0 0 70 250" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              <path d="M 200 220 A 30 30 0 0 1 170 250" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              <circle cx="120" cy="150" fill="currentColor" fillOpacity="0.75" r="2.5" />
              <line stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" x1="110" x2="130" y1="150" y2="150" />
              <line stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" x1="120" x2="120" y1="140" y2="160" />
            </svg>
            <div className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-85 shadow-[0_0_12px_rgba(223,122,122,0.9)] animate-scanLaser" />
            <div className="absolute top-[28%] left-[30%] flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[9px] font-label-sm text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> T-Zone
            </div>
            <div className="absolute bottom-[32%] right-[24%] flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[9px] font-label-sm text-on-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Malar
            </div>
          </div>

          <div className="absolute bottom-space-md z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1 rounded-full shadow-sm">
            <Icon name="verified" className="text-[15px] text-secondary" />
            <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">
              AI Focal Locked • 1080p Telemetry
            </span>
          </div>
        </section>

        <div className="flex items-center justify-between gap-space-sm p-space-md rounded-lg bg-surface-container-low shadow-sm">
          <div className="flex items-start gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="save" className="text-[16px]" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-label-md text-label-md font-bold text-on-surface">Save this photo?</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Off by default — we just analyze and discard it. If you turn this on, we'll keep it to show your
                progress over time, and auto-delete it after {PHOTO_RETENTION_DAYS} days.
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={storeConsent}
            onChange={(v) => {
              setStoreConsent(v);
              showToast(v ? `Will save this photo for ${PHOTO_RETENTION_DAYS} days` : 'Photo will not be saved');
            }}
            label="Save this photo for progress history"
          />
        </div>

        <div className="flex items-center justify-between gap-space-xs overflow-x-auto py-0.5 no-scrollbar">
          {TIPS.map((tip) => (
            <div
              key={tip.label}
              className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full bg-surface-container-low text-on-surface"
            >
              <Icon name={tip.icon} className={`text-[15px] ${tip.color}`} />
              <span className="font-label-sm text-label-sm font-semibold truncate">{tip.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-space-md pt-space-xs">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-3 rounded-full bg-primary-container/20 blur-md pointer-events-none" />
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => cameraInputRef.current?.click()}
              aria-label="Open camera and take a selfie"
              className="relative group flex items-center justify-center w-20 h-20 rounded-full bg-surface-container-lowest shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-70"
            >
              <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-primary-fixed to-primary-container p-1 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-surface-container-lowest flex items-center justify-center shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-primary-container group-active:scale-90 transition-transform flex items-center justify-center text-on-primary shadow-sm">
                    <Icon name="photo_camera" className="text-[24px]" />
                  </div>
                </div>
              </div>
            </button>
          </div>
          <span className="font-label-md text-label-md font-semibold text-on-surface">Take a Selfie</span>

          {/* capture=user/environment tells mobile browsers (Android Chrome
              in particular) to open the native camera app directly for this
              input, instead of a plain file picker. */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture={lensFront ? 'user' : 'environment'}
            className="hidden"
            onChange={handleCameraChange}
          />
          <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryChange} />
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-full h-13 py-3 px-space-md flex items-center justify-center gap-space-xs rounded-full bg-surface-container-high text-on-surface active:bg-surface-container-highest transition-colors"
          >
            <Icon name="photo_library" className="text-[20px] text-on-surface-variant" />
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">Upload from Gallery</span>
          </button>

          {hasRealPhoto && (
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="w-full h-13 py-3 px-space-md flex items-center justify-center gap-space-xs rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-sm active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <Icon
                name={isAnalyzing ? 'progress_activity' : 'auto_awesome'}
                className={`text-[20px] ${isAnalyzing ? 'animate-spin' : ''}`}
              />
              <span>{isAnalyzing ? 'Analyzing your skin...' : 'Analyze My Skin'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-center text-center px-space-md py-space-sm rounded-lg bg-surface-container-high/60">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Cosmetic observation only. SkinAI does not replace medical dermatological diagnoses or prescription care.
          </p>
        </div>
      </div>
    </TabLayout>
  );
}
