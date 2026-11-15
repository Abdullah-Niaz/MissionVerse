import React, { useState } from 'react';
import { 
  Wind, Zap, BatteryCharging, Bot, BookOpen, Radio, 
  Volume2, VolumeX, LogOut, ChevronDown, ChevronUp, Sparkles, CheckSquare, Square
} from 'lucide-react';
import { Mission, ResourceState, PlanetEnvironment } from '../types';
import { sound } from '../utils/audio';

interface Props {
  callsign: string;
  planet: PlanetEnvironment;
  resources: ResourceState;
  currentMission?: Mission;
  completedObjectives: string[];
  proximityObject: { objectId: string; name: string; isRecharge?: boolean } | null;
  inRover: boolean;
  onOpenMentor: () => void;
  onOpenJournal: () => void;
  onOpenNASA: () => void;
  onInteract: () => void;
  onExit: () => void;
  toastMessage?: string | null;
}

export const HUD: React.FC<Props> = ({
  callsign,
  planet,
  resources,
  currentMission,
  completedObjectives,
  proximityObject,
  inRover,
  onOpenMentor,
  onOpenJournal,
  onOpenNASA,
  onInteract,
  onExit,
  toastMessage
}) => {
  const [missionExpanded, setMissionExpanded] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleAudio = () => {
    sound.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) sound.playClick();
  };

  const isLowOxygen = resources.oxygen < 20;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 z-20">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Left: Astronaut Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white ${
            planet === 'moon' ? 'bg-blue-600' : 'bg-red-600'
          }`}>
            {callsign.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white">{callsign}</span>
              {inRover && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/40">
                  ROVER
                </span>
              )}
            </div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${
              planet === 'moon' ? 'text-blue-400' : 'text-red-400'
            }`}>
              {planet === 'moon' ? 'Moon Expedition' : 'Mars Expedition'}
            </span>
          </div>
        </div>

        {/* Center: Dynamic Resource Meters */}
        <div className="pointer-events-auto flex items-center gap-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-2xl shadow-xl">
          {/* Oxygen Meter */}
          <div className="flex items-center gap-2">
            <Wind className={`w-4 h-4 ${isLowOxygen ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
            <div className="w-20 sm:w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isLowOxygen ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'
                }`}
                style={{ width: `${resources.oxygen}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${isLowOxygen ? 'text-red-400' : 'text-slate-300'}`}>
              {resources.oxygen}%
            </span>
          </div>

          <div className="w-px h-5 bg-slate-700" />

          {/* Energy Meter */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="w-16 sm:w-20 bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${resources.energy}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">{resources.energy}%</span>
          </div>

          <div className="w-px h-5 bg-slate-700" />

          {/* Battery Meter */}
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <div className="w-16 sm:w-20 bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${resources.battery}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">{resources.battery}%</span>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-xl">
          {/* AI Mentor Button */}
          <button
            onClick={() => { sound.playClick(); onOpenMentor(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
            title="Ask AstroGuide AI Mentor"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AstroGuide</span>
          </button>

          {/* Discovery Journal */}
          <button
            onClick={() => { sound.playClick(); onOpenJournal(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Discovery Journal & Badges"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* NASA Terminal */}
          <button
            onClick={() => { sound.playClick(); onOpenNASA(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="NASA Space Weather Terminal"
          >
            <Radio className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={audioEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* Exit / Menu */}
          <button
            onClick={() => { sound.playClick(); onExit(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Return to Menu"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Center Toast Message */}
      {toastMessage && (
        <div className="self-center bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-2xl shadow-2xl border border-blue-400 animate-bounce pointer-events-auto">
          {toastMessage}
        </div>
      )}

      {/* Bottom Area: Mission Drawer & Interaction Pill */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 w-full">
        {/* Mission Objectives Card (Bottom Left) */}
        {currentMission && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl max-w-sm w-full">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setMissionExpanded(!missionExpanded)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-extrabold text-sm text-white">{currentMission.title}</h4>
              </div>
              {missionExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {missionExpanded && (
              <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-400 mb-2">{currentMission.summary}</p>
                {currentMission.objectives.map((obj) => {
                  const isDone = completedObjectives.includes(obj.id);
                  return (
                    <div key={obj.id} className="flex items-start gap-2 text-xs">
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <span className={isDone ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {obj.title}
                      </span>
                    </div>
                  );
                })}

                <button
                  onClick={() => { sound.playClick(); onOpenMentor(); }}
                  className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AstroGuide for Hint</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Center Bottom: Interaction Pill */}
        {proximityObject && (
          <div className="pointer-events-auto self-center bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-2xl shadow-2xl border-2 border-blue-400 flex items-center gap-3 cursor-pointer transform hover:scale-105 active:scale-95 transition-all animate-pulse"
               onClick={() => { sound.playClick(); onInteract(); }}>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Press [E]</span>
            <span className="text-sm">
              {proximityObject.isRecharge
                ? 'Recharge Suit & Oxygen'
                : (proximityObject.objectId.includes('rover')
                    ? (inRover ? 'Dismount Rover' : 'Drive Rover')
                    : `Inspect ${proximityObject.name}`)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
