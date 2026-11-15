export type PlanetEnvironment = 'moon' | 'mars';

export interface AvatarOption {
  id: string;
  name: string;
  callsign: string;
  suitColor: string;
  visorColor: string;
  specialty: string;
  description: string;
}

export interface PlayerProfile {
  avatarId: string;
  name: string;
  selectedPlanet: PlanetEnvironment;
}

export interface ResourceState {
  oxygen: number;     // 0-100%
  energy: number;     // 0-100%
  battery: number;    // 0-100%
  samples: number;    // count
}

export interface MissionObjective {
  id: string;
  title: string;
  type: 'movement' | 'interact' | 'explore';
  target: string;
  description: string;
  isCompleted?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  environment: PlanetEnvironment;
  difficulty: 'easy' | 'medium' | 'hard';
  summary: string;
  learning_objectives: string[];
  objectives: MissionObjective[];
  completion_badge: string;
  learning_recap: string[];
}

export interface DiscoveryItem {
  id: string;
  name: string;
  planet: PlanetEnvironment;
  category: string;
  fact: string;
  concept: string;
  discoveredAt?: string;
}

export interface GuestSaveState {
  version: number;
  sessionId: string;
  updatedAt: string;
  player: PlayerProfile;
  resources: ResourceState;
  completedMissions: string[];
  currentMissionIndex: number;
  discoveries: string[];
  badges: string[];
}
