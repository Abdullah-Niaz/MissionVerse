import React, { useState, useRef, useEffect } from 'react';
import { eventBridge } from '../game/EventBridge';
import { Compass, Hand } from 'lucide-react';
import { sound } from '../utils/audio';

export const VirtualJoystick: React.FC = () => {
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setActive(true);
    updateVector(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateVector(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setActive(false);
        setKnobPos({ x: 0, y: 0 });
        eventBridge.emit('INPUT_MOVE', { x: 0, y: 0 });
        break;
      }
    }
  };

  const updateVector = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let kx = dx;
    let ky = dy;

    if (dist > maxRadius) {
      kx = (dx / dist) * maxRadius;
      ky = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: kx, y: ky });
    eventBridge.emit('INPUT_MOVE', {
      x: kx / maxRadius,
      y: ky / maxRadius
    });
  };

  return (
    <div className="sm:hidden pointer-events-none fixed inset-0 z-30 select-none">
      {/* Joystick Area (Bottom Left) */}
      <div className="absolute left-6 bottom-8 pointer-events-auto">
        <div
          ref={baseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-28 h-28 rounded-full bg-slate-900/60 backdrop-blur-md border-2 border-slate-600/50 relative flex items-center justify-center shadow-2xl"
        >
          {/* Thumb Knob */}
          <div
            className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white shadow-lg transition-transform pointer-events-none"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          />
        </div>
      </div>

      {/* Action / Inspect Button (Bottom Right) */}
      <div className="absolute right-6 bottom-8 pointer-events-auto">
        <button
          onClick={() => {
            sound.playClick();
            eventBridge.emit('INTERACT_TRIGGERED');
          }}
          className="w-18 h-18 rounded-full bg-blue-600 active:bg-blue-700 text-white border-2 border-blue-400 flex flex-col items-center justify-center shadow-2xl cursor-pointer"
        >
          <Hand className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">ACTION</span>
        </button>
      </div>
    </div>
  );
};
