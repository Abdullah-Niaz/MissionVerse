import React, { useState } from 'react';
import { User, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { AvatarOption } from '../types';
import { sound } from '../utils/audio';

const AVATARS: AvatarOption[] = [
  {
    id: 'nova',
    name: 'Nova',
    callsign: 'Astronaut Nova',
    suitColor: 'from-amber-500 to-orange-600',
    visorColor: '#f59e0b',
    specialty: 'Expedition Commander',
    description: 'Enthusiastic explorer who loves investigating unknown crater shadows.'
  },
  {
    id: 'orion',
    name: 'Orion',
    callsign: 'Astronaut Orion',
    suitColor: 'from-blue-500 to-indigo-600',
    visorColor: '#38bdf8',
    specialty: 'Robotics & Rover Specialist',
    description: 'Master of rover steering and calibrating base solar arrays.'
  },
  {
    id: 'astra',
    name: 'Astra',
    callsign: 'Astronaut Astra',
    suitColor: 'from-emerald-500 to-teal-600',
    visorColor: '#34d399',
    specialty: 'Planetary Geologist',
    description: 'Fascinated by ancient basalt rocks and finding trapped water ice.'
  },
  {
    id: 'cosmo',
    name: 'Cosmo',
    callsign: 'Astronaut Cosmo',
    suitColor: 'from-purple-500 to-pink-600',
    visorColor: '#c084fc',
    specialty: 'Atmospheric Scientist',
    description: 'Studies solar winds, Martian dust devils, and space radiation.'
  }
];

interface Props {
  onConfirm: (avatar: AvatarOption, name: string) => void;
  onBack: () => void;
  initialAvatarId?: string;
  initialName?: string;
}

export const AvatarSelect: React.FC<Props> = ({ onConfirm, onBack, initialAvatarId = 'nova', initialName }) => {
  const [selectedId, setSelectedId] = useState(initialAvatarId);
  const [callsign, setCallsign] = useState(initialName || AVATARS.find(a => a.id === initialAvatarId)?.callsign || 'Astronaut Nova');

  const selectedAvatar = AVATARS.find(a => a.id === selectedId) || AVATARS[0];

  const handleSelect = (avatar: AvatarOption) => {
    sound.playClick();
    setSelectedId(avatar.id);
    setCallsign(avatar.callsign);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onConfirm(selectedAvatar, callsign.trim() || selectedAvatar.callsign);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 1 of 2: Astronaut Selection</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black mb-2">Choose Your Astronaut</h2>
          <p className="text-slate-400 text-sm sm:text-base">Select your spacesuit profile and customize your mission callsign.</p>
        </div>

        {/* Avatar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {AVATARS.map((avatar) => {
            const isSelected = avatar.id === selectedId;
            return (
              <div
                key={avatar.id}
                onClick={() => handleSelect(avatar)}
                className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  isSelected
                    ? 'border-blue-500 bg-slate-900 shadow-xl shadow-blue-500/20 scale-102'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                {/* Visual Avatar Suit Preview */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatar.suitColor} flex items-center justify-center mb-4 shadow-md relative`}>
                  <div className="w-10 h-7 rounded-full bg-slate-900/80 border-2 border-amber-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/70 -mt-2 -ml-3" />
                  </div>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-white mb-1">{avatar.name}</h3>
                <span className="text-xs font-semibold text-blue-400 mb-2">{avatar.specialty}</span>
                <p className="text-xs text-slate-400 leading-snug">{avatar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Callsign Input Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Astronaut Callsign
          </label>
          <div className="relative mb-6">
            <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={callsign}
              maxLength={24}
              onChange={(e) => setCallsign(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-base focus:outline-none focus:border-blue-500 font-medium"
              placeholder="Enter callsign..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
          >
            <span>Confirm Astronaut & Proceed</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
