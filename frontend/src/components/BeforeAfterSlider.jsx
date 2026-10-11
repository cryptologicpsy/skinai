import { useRef, useState } from 'react';
import Icon from './Icon.jsx';

export default function BeforeAfterSlider({ before, after }) {
  const containerRef = useRef(null);
  const [percent, setPercent] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPercent((x / rect.width) * 100);
  };

  const onPointerDown = (e) => {
    draggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromClientX(clientX);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromClientX(clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-72 rounded-DEFAULT overflow-hidden select-none bg-surface-dim cursor-ew-resize"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div className="absolute inset-0 w-full h-full">
        <img className="w-full h-full object-cover pointer-events-none" alt="After — current skin" src={after.image} />
        <div className="absolute bottom-4 right-4 bg-surface-container-lowest/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-label-md text-label-md text-on-surface">{after.metricLabel}</span>
        </div>
        <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface font-label-sm text-label-sm font-semibold">
          {after.label}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 overflow-hidden shadow-2xl" style={{ width: `${percent}%` }}>
        <div className="relative w-full h-full min-w-[320px]">
          <img
            className="absolute inset-y-0 left-0 h-full max-w-none object-cover pointer-events-none"
            alt="Before — baseline skin"
            src={before.image}
            style={{ width: 'calc(100vw - 2.5rem)' }}
          />
          <div className="absolute bottom-4 left-4 bg-surface-container-lowest/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-md text-label-md text-on-surface">{before.metricLabel}</span>
          </div>
          <div className="absolute top-4 left-4 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-full text-on-surface font-label-sm text-label-sm font-semibold">
            {before.label}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-y-0 -ml-3 w-6 flex items-center justify-center z-20"
        style={{ left: `${percent}%` }}
      >
        <div className="w-0.5 h-full bg-surface-container-lowest shadow-md" />
        <div className="absolute w-8 h-8 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center text-primary transform transition-transform active:scale-110">
          <Icon name="drag_indicator" className="text-[16px]" />
        </div>
      </div>
    </div>
  );
}
