import React from 'react';
import { X, Sparkles, Check, Bot } from 'lucide-react';
import { PlanetEnvironment } from '../types';
import { sound } from '../utils/audio';

interface DiscoveryData {
  id: string;
  name: string;
  planet: PlanetEnvironment;
  concept: string;
  fact: string;
  details: string;
}

const DISCOVERY_DETAILS: Record<string, DiscoveryData> = {
  lunar_lander: {
    id: 'lunar_lander',
    name: 'Artemis Lunar Lander',
    planet: 'moon',
    concept: 'Lunar Landing Engineering & Regolith Bearing',
    fact: 'The lander has dish-shaped circular footpads so it will not sink into deep, powdery lunar dust!',
    details: 'Because the Moon has no atmosphere, the lander requires no wings or aerodynamics. Its golden foil thermal blankets insulate astronauts from extreme temperature swings (-130°C to +120°C).'
  },
  crater_rim: {
    id: 'crater_rim',
    name: 'Shackleton Crater Rim',
    planet: 'moon',
    concept: 'Meteorite Impact Dynamics & Water Ice',
    fact: 'Craters on the Moon never erode because there is no air, rain, or wind to wear down their sharp edges.',
    details: 'Scientists believe deep, permanently shadowed crater bottoms near the lunar south pole contain billions of tons of water ice, crucial for future rocket fuel and drinking water!'
  },
  regolith_deposit: {
    id: 'regolith_deposit',
    name: 'Lunar Regolith (Moon Dust)',
    planet: 'moon',
    concept: 'Micrometeoroid Bombardment & Volcanic Glass',
    fact: 'Moon dust grains are razor-sharp like broken glass because there is no river water or breeze to tumble and round them.',
    details: 'Apollo astronauts reported that regolith clings to everything due to static electricity and smells like burnt gunpowder!'
  },
  solar_array: {
    id: 'solar_array',
    name: 'Lunar Solar Array',
    planet: 'moon',
    concept: 'Solar Energy & Long Lunar Nights',
    fact: 'A single day on the Moon lasts approximately 29 Earth days—meaning 14 straight days of sunlight followed by 14 days of freezing night!',
    details: 'Base solar panels rotate to follow the slow-moving Sun, storing massive electricity in batteries to power life-support heaters.'
  },
  lunar_rover: {
    id: 'lunar_rover',
    name: 'Lunar Roving Vehicle',
    planet: 'moon',
    concept: 'Extraterrestrial Mobility & Wire Mesh Wheels',
    fact: 'The rover does not use rubber tires! They are woven from zinc-coated piano steel wire mesh so they do not pop in vacuum.',
    details: 'Astronauts on Apollo 15, 16, and 17 drove rovers up to 35 kilometers across hills and boulders, discovering orange volcanic soil.'
  },
  mars_weather_station: {
    id: 'mars_weather_station',
    name: 'Martian Atmospheric Station',
    planet: 'mars',
    concept: 'Thin Carbon Dioxide Atmosphere',
    fact: 'Mars has an atmosphere less than 1% as dense as Earth, and it is 95% carbon dioxide ($CO_2$).',
    details: 'Because the air is so thin, sound travels much slower on Mars, and heat escapes into space rapidly, making Martian nights bitterly cold (-70°C).'
  },
  mars_rock_formation: {
    id: 'mars_rock_formation',
    name: 'Volcanic Basalt Outcrop',
    planet: 'mars',
    concept: 'Planetary Geology & Rust (Iron Oxide)',
    fact: 'Mars is red because its rocks and dust are rich in iron oxide—the exact same chemical that causes rusty iron on Earth!',
    details: 'Billions of years ago, volcanoes like Olympus Mons erupted rivers of lava. The iron in the basalt reacted with trace oxygen, turning the entire planet rust-red.'
  },
  ancient_riverbed: {
    id: 'ancient_riverbed',
    name: 'Jezero Ancient River Delta',
    planet: 'mars',
    concept: 'Ancient Martian Water & Habitability',
    fact: 'Smooth rounded pebbles and branching delta channels prove that rivers of liquid water flowed on Mars billions of years ago!',
    details: 'NASA’s Perseverance rover explores this exact crater today, collecting rock cores to search for fossilized microscopic life.'
  },
  mars_rover: {
    id: 'mars_rover',
    name: 'Mars Exploration Rover',
    planet: 'mars',
    concept: 'Autonomous Planetary Robotics',
    fact: 'Rovers take hours to receive signals from Earth, so they use AI cameras to spot and drive around dangerous boulders on their own.',
    details: 'Powered by solar panels or nuclear thermoelectric generators, rovers have lasers that can vaporize rocks to analyze their mineral chemistry.'
  },
  mars_habitat_computer: {
    id: 'mars_habitat_computer',
    name: 'Atmospheric Habitat Monitor',
    planet: 'mars',
    concept: 'Global Dust Storms & Radiation Protection',
    fact: 'Martian dust storms can swell to cover the entire planet, blotting out the Sun for months at a time!',
    details: 'Without Earth’s thick atmosphere and magnetic shield, cosmic radiation is a serious challenge. Future astronauts will live inside shielded habitats or underground lava tubes.'
  }
};

interface Props {
  objectId: string;
  onClose: () => void;
  onLogDiscovery: (id: string) => void;
  onAskMentor: (topic: string) => void;
}

export const DiscoveryModal: React.FC<Props> = ({ objectId, onClose, onLogDiscovery, onAskMentor }) => {
  const data = DISCOVERY_DETAILS[objectId] || {
    id: objectId,
    name: objectId.replace('_', ' ').toUpperCase(),
    planet: 'moon',
    concept: 'Space Exploration Discovery',
    fact: 'Every scientific landmark on the Moon and Mars tells an important part of our solar system history!',
    details: 'Keep exploring to discover more planetary mysteries.'
  };

  const handleCollect = () => {
    sound.playFanfare();
    onLogDiscovery(data.id);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-blue-500/80 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Scientific Discovery</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1">{data.name}</h2>
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-4">
          Concept: {data.concept}
        </span>

        {/* Fact Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4">
          <p className="text-xs uppercase font-bold text-slate-400 mb-1">Key Scientific Fact:</p>
          <p className="text-sm sm:text-base font-medium text-amber-200 leading-snug">
            "{data.fact}"
          </p>
        </div>

        {/* Details Explanation */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          {data.details}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCollect}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
          >
            <Check className="w-4 h-4" />
            <span>Collect Sample & Log Discovery</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onAskMentor(data.concept);
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AstroGuide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
