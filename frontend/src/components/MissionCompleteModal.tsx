import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Mission } from '../types';
import { sound } from '../utils/audio';

interface Props {
  mission: Mission;
  onNextMission: () => void;
}

export const MissionCompleteModal: React.FC<Props> = ({ mission, onNextMission }) => {
  useEffect(() => {
    sound.playFanfare();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if confetti fails
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
          <Award className="w-9 h-9 text-slate-950 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mission Accomplished!</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1">{mission.title}</h2>
        <p className="text-xs text-slate-400 mb-6">You successfully completed all scientific objectives.</p>

        {/* Badge Awarded */}
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
            New Curiosity Badge Earned:
          </span>
          <h3 className="text-lg font-black text-amber-200 flex items-center justify-center gap-2">
            <span>🏆</span>
            <span>{mission.completion_badge}</span>
          </h3>
        </div>

        {/* What You Learned */}
        <div className="text-left bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 mb-6">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>What You Learned Today:</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {mission.learning_recap.map((recap, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>{recap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Mission Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNextMission();
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-500/30"
        >
          <span>Continue to Next Mission</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
