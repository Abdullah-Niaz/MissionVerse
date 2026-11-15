import React, { useEffect, useState } from 'react';
import { X, Radio, Sun, ShieldAlert, Sprout, ExternalLink, Key, Check, Globe } from 'lucide-react';
import { ApiService } from '../services/api';
import { sound } from '../utils/audio';

interface Props {
  onClose: () => void;
}

export const NASAModal: React.FC<Props> = ({ onClose }) => {
  const [topic, setTopic] = useState<'space_weather' | 'radiation' | 'biology' | 'mars_trek'>('space_weather');
  const [data, setData] = useState<{
    title: string;
    source: string;
    recorded_at: string;
    kid_friendly_summary: string;
    current_solar_activity: string;
    educational_takeaway: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('nasa_custom_api_key') || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const loadData = async (selectedTopic: 'space_weather' | 'radiation' | 'biology' | 'mars_trek') => {
    if (selectedTopic === 'mars_trek') return;
    setLoading(true);
    try {
      const res = await ApiService.fetchNASAData(selectedTopic);
      setData(res);
    } catch {
      // Handled by api fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(topic);
  }, [topic]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    localStorage.setItem('nasa_custom_api_key', apiKeyInput.trim());
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-3xl max-w-xl w-full max-h-[90vh] text-white shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white">NASA Scientific Gateway</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded">CONNECTED</span>
              </div>
              <p className="text-xs text-slate-400">Integrated with Official NASA Exploration & Research Services</p>
            </div>
          </div>

          {/* Topic Tabs */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <button
              onClick={() => { sound.playClick(); setTopic('space_weather'); }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                topic === 'space_weather'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="truncate">Solar Wind</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setTopic('radiation'); }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                topic === 'radiation'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="truncate">Radiation</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setTopic('biology'); }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                topic === 'biology'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span className="truncate">Plants</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setTopic('mars_trek'); }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                topic === 'mars_trek'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate">Mars Trek</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {topic === 'mars_trek' ? (
            <div className="space-y-4">
              <div className="bg-orange-950/40 border border-orange-800/60 p-5 rounded-2xl">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block mb-1">
                  NASA Jet Propulsion Laboratory (JPL)
                </span>
                <h3 className="font-black text-lg text-white mb-2">NASA Mars Trek 3D Globe</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  NASA Mars Trek provides interactive 2D and 3D terrain maps of Mars compiled from decades of Mars orbiter and rover imagery. You can measure real craters, view Jezero Crater, explore Olympus Mons, and plan your exploration routes!
                </p>

                <a
                  href="https://trek.nasa.gov/mars/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  <span>Launch NASA Mars Trek in New Window</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 space-y-1.5">
                <p className="font-bold text-slate-200">What to look for on Mars Trek:</p>
                <p>• <strong>Jezero Crater:</strong> The landing site for NASA’s Perseverance rover (where MissionVerse Mission R-03 takes place).</p>
                <p>• <strong>Valles Marineris:</strong> The Grand Canyon of Mars, stretching over 4,000 km across the equator.</p>
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="h-40 flex items-center justify-center text-xs text-slate-400 gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Fetching telemetry from NASA servers...</span>
                </div>
              ) : data && (
                <div className="space-y-4">
                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-cyan-400">{data.source}</span>
                      {topic === 'space_weather' && (
                        <a
                          href="https://ccmc.gsfc.nasa.gov/tools/DONKI/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>DONKI Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {topic === 'radiation' && (
                        <a
                          href="https://visualization.osdr.nasa.gov/radlab/gui/data-api/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>RadLab Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {topic === 'biology' && (
                        <a
                          href="https://osdr.nasa.gov/bio/repo/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>OSDR Repo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <h3 className="font-extrabold text-base text-white mb-2">{data.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                      {data.kid_friendly_summary}
                    </p>
                    <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/50 text-xs font-bold text-cyan-200">
                      {data.current_solar_activity}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Astronaut Takeaway:</span>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {data.educational_takeaway}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* NASA API Key Custom Entry */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom NASA API Key (Optional)</span>
              </div>
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Get Free Key at api.nasa.gov</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <form onSubmit={handleSaveApiKey} className="flex gap-2">
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your api.nasa.gov key or leave blank for DEMO_KEY"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                {apiKeySaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Save'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer with Resource Links */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Official NASA Open Science Resources:</span>
          <div className="flex items-center gap-3 text-cyan-400">
            <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:underline">api.nasa.gov</a>
            <span>•</span>
            <a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noopener noreferrer" className="hover:underline">DONKI</a>
            <span>•</span>
            <a href="https://osdr.nasa.gov/bio/repo/" target="_blank" rel="noopener noreferrer" className="hover:underline">OSDR</a>
            <span>•</span>
            <a href="https://trek.nasa.gov/mars/" target="_blank" rel="noopener noreferrer" className="hover:underline">Mars Trek</a>
          </div>
        </div>
      </div>
    </div>
  );
};
