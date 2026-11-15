import React, { useState } from 'react';
import { ArrowLeft, Rocket, Globe, Compass, CheckCircle2 } from 'lucide-react';
import { PlanetEnvironment } from '../types';
import { sound } from '../utils/audio';

interface Props {
  onSelect: (planet: PlanetEnvironment) => void;
  onBack: () => void;
  initialPlanet?: PlanetEnvironment;
}

export const PlanetSelect: React.FC<Props> = ({ onSelect, onBack, initialPlanet = 'moon' }) => {
  const [selected, setSelected] = useState<PlanetEnvironment>(initialPlanet);

  const handleLaunch = () => {
    sound.playClick();
    onSelect(selected);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Astronaut</span>
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 2 of 2: Destination</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black mb-2">Select Your Destination</h2>
          <p className="text-slate-400 text-sm sm:text-base">Choose which planetary environment you want to explore first.</p>
        </div>

        {/* Planet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Moon Card */}
          <div
            onClick={() => { sound.playClick(); setSelected('moon'); }}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selected === 'moon'
                ? 'border-blue-500 bg-slate-900 shadow-2xl shadow-blue-500/20 scale-102'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            {selected === 'moon' && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 flex items-center justify-center mb-4 shadow-lg shadow-slate-500/20">
                <div className="w-5 h-5 rounded-full bg-slate-600/40 -mt-4 -ml-4" />
                <div className="w-7 h-7 rounded-full bg-slate-800/30 mt-3 ml-2" />
              </div>

              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Cadet Expedition</span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">The Moon</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Explore the lunar south pole, inspect the Artemis Lander, traverse Shackleton Crater, and collect volcanic glass regolith.
              </p>

              <div className="space-y-2 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>Gravity:</span>
                  <span className="text-slate-200 font-semibold">1.62 m/s² (1/6th Earth)</span>
                </div>
                <div className="flex justify-between">
                  <span>Atmosphere:</span>
                  <span className="text-slate-200 font-semibold">None (Space Vacuum)</span>
                </div>
                <div className="flex justify-between">
                  <span>Missions:</span>
                  <span className="text-blue-400 font-bold">5 Guided Missions</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Features: Lunar Rover, Craters, Solar Arrays</span>
            </div>
          </div>

          {/* Mars Card */}
          <div
            onClick={() => { sound.playClick(); setSelected('mars'); }}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selected === 'mars'
                ? 'border-red-500 bg-slate-900 shadow-2xl shadow-red-500/20 scale-102'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            {selected === 'mars' && (
              <div className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-red-800 flex items-center justify-center mb-4 shadow-lg shadow-red-500/20">
                <div className="w-6 h-6 rounded-full bg-red-950/40 -mt-3 -ml-3" />
                <div className="w-8 h-8 rounded-full bg-amber-900/40 mt-4 ml-1" />
              </div>

              <span className="text-xs font-extrabold uppercase tracking-wider text-red-400">Officer Expedition</span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">Mars (Red Planet)</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Drive the Mars exploration rover across Jezero dunes, test ancient dried riverbeds for water ice, and monitor dust storm barometers.
              </p>

              <div className="space-y-2 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>Gravity:</span>
                  <span className="text-slate-200 font-semibold">3.72 m/s² (38% Earth)</span>
                </div>
                <div className="flex justify-between">
                  <span>Atmosphere:</span>
                  <span className="text-slate-200 font-semibold">Thin Carbon Dioxide</span>
                </div>
                <div className="flex justify-between">
                  <span>Missions:</span>
                  <span className="text-red-400 font-bold">5 Guided Missions</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-red-400" />
              <span>Features: Drivable Rover, Ancient Riverbed, Dust Storms</span>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="text-center">
          <button
            onClick={handleLaunch}
            className={`px-10 py-4 rounded-2xl font-extrabold text-lg text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 inline-flex items-center gap-3 cursor-pointer ${
              selected === 'moon'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/30'
                : 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-600/30'
            }`}
          >
            <Rocket className="w-5 h-5 fill-current" />
            <span>Launch to {selected === 'moon' ? 'The Moon' : 'Mars'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
