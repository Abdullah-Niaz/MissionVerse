import React from 'react';
import { Rocket, ShieldCheck, Sparkles, Compass, Award, Play } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onStart: () => void;
  onResume?: () => void;
  savedName?: string;
  savedPlanet?: string;
}

export const WelcomeScreen: React.FC<Props> = ({ onStart, onResume, savedName, savedPlanet }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-blue-400">MISSION<span className="text-white">VERSE</span></span>
            <p className="text-xs text-slate-400">Junior Astronaut Mission Trainer</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>COPPA Safe & Guest Ready</span>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Learn Real Space Science by Exploring It</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-200 via-indigo-100 to-amber-200 bg-clip-text text-transparent">
          Explore the Moon & Mars
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Suit up, Junior Astronaut! Roam top-down 2D worlds, pilot planetary rovers, manage life support resources, and discover the secrets of our solar system with your guided AI mentor.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <Compass className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-bold text-sm text-slate-200">Free 2D Exploration</h3>
            <p className="text-xs text-slate-400 mt-1">Walk crater rims, explore bases, and drive rovers without fixed rails.</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-400 mb-2" />
            <h3 className="font-bold text-sm text-slate-200">AstroGuide AI Mentor</h3>
            <p className="text-xs text-slate-400 mt-1">Get kid-friendly, encouraging hints without giving away every answer.</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <Award className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="font-bold text-sm text-slate-200">Zero Punishment</h3>
            <p className="text-xs text-slate-400 mt-1">Focus on learning, curiosity badges, and real NASA scientific data.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onStart();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-lg shadow-xl shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start New Expedition</span>
          </button>

          {onResume && savedName && (
            <button
              onClick={() => {
                sound.playClick();
                onResume();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Resume: {savedName} ({savedPlanet?.toUpperCase()})</span>
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500 py-2">
        <p>MissionVerse MVP v1.0 · Designed for Ages 7–12 · No Personal Information Collected</p>
      </footer>
    </div>
  );
};
