import React, { useState } from 'react';
import { X, Award, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  badges: string[];
  discoveries: string[];
  samplesCount: number;
  onClose: () => void;
}

const ALL_BADGES: { id: string; title: string; desc: string; icon: string }[] = [
  { id: 'First Steps Badge', title: 'First Steps Badge', desc: 'Acclimated to low gravity and visited the Apollo Lunar Lander.', icon: '🚀' },
  { id: 'Crater Detective', title: 'Crater Detective', desc: 'Explored Shackleton Crater and learned how impact craters form.', icon: '🔍' },
  { id: 'Lunar Geologist', title: 'Lunar Geologist', desc: 'Collected lunar regolith volcanic dust core samples.', icon: '💎' },
  { id: 'Station Commander', title: 'Station Commander', desc: 'Calibrated base solar arrays for extreme day/night cycles.', icon: '⚡' },
  { id: 'Master Lunar Navigator', title: 'Master Lunar Navigator', desc: 'Restored battery power to the Lunar Roving Vehicle.', icon: '🚙' },
  { id: 'Red Planet Pioneer', title: 'Red Planet Pioneer', desc: 'Deployed meteorological sensors on Martian iron oxide soil.', icon: '🪐' },
  { id: 'Martian Geologist', title: 'Martian Geologist', desc: 'Scanned basalt rocks and ancient volcanic geology on Mars.', icon: '🌋' },
  { id: 'Hydro Detective', title: 'Hydro Detective', desc: 'Discovered dried riverbed evidence of ancient Martian water.', icon: '💧' },
  { id: 'Rover Ace', title: 'Rover Ace', desc: 'Drove the Mars robotic rover across rugged sand dunes.', icon: '🏎️' },
  { id: 'Chief Science Officer', title: 'Chief Science Officer', desc: 'Monitored Martian global dust storms and calibrated shielding.', icon: '🛡️' }
];

export const JournalModal: React.FC<Props> = ({ badges, discoveries, samplesCount, onClose }) => {
  const [tab, setTab] = useState<'badges' | 'discoveries'>('badges');

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl max-w-lg w-full h-[540px] text-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white">Discovery Journal</span>
              <p className="text-xs text-slate-400">Your Scientific Achievements & Field Notes</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Stats */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setTab('badges'); }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                tab === 'badges'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Badges ({badges.length}/{ALL_BADGES.length})
            </button>
            <button
              onClick={() => { sound.playClick(); setTab('discoveries'); }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                tab === 'discoveries'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Landmarks ({discoveries.length})
            </button>
          </div>

          <div className="text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{samplesCount} Samples</span>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {tab === 'badges' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_BADGES.map((b) => {
                const isUnlocked = badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-white">{b.title}</h4>
                        {isUnlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {discoveries.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                  <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
                  <span>No landmarks inspected yet! Walk up to craters, landers, or rocks and press [E] to log them.</span>
                </div>
              ) : (
                discoveries.map((id) => (
                  <div key={id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200 capitalize">
                      {id.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Logged
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
