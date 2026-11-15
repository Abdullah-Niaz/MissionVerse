import { GuestSaveState, PlayerProfile, ResourceState } from '../types';

const STORAGE_KEY = 'missionverse_guest_save_v1';

export const defaultSaveState: GuestSaveState = {
  version: 1,
  sessionId: 'guest-' + Math.random().toString(36).substring(2, 9),
  updatedAt: new Date().toISOString(),
  player: {
    avatarId: 'nova',
    name: 'Astronaut Nova',
    selectedPlanet: 'moon'
  },
  resources: {
    oxygen: 100,
    energy: 100,
    battery: 100,
    samples: 0
  },
  completedMissions: [],
  currentMissionIndex: 0,
  discoveries: [],
  badges: []
};

export const StorageService = {
  load(): GuestSaveState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultSaveState;
      const parsed = JSON.parse(data);
      if (parsed.version === 1 && parsed.player) {
        return parsed as GuestSaveState;
      }
    } catch (e) {
      console.warn('Could not read saved progress, using default state', e);
    }
    return defaultSaveState;
  },

  save(state: GuestSaveState): void {
    try {
      const toSave = {
        ...state,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },

  updateResources(res: Partial<ResourceState>): GuestSaveState {
    const current = this.load();
    const updated = {
      ...current,
      resources: { ...current.resources, ...res }
    };
    this.save(updated);
    return updated;
  },

  addDiscovery(discoveryId: string): GuestSaveState {
    const current = this.load();
    if (!current.discoveries.includes(discoveryId)) {
      current.discoveries.push(discoveryId);
      this.save(current);
    }
    return current;
  },

  addBadge(badgeId: string): GuestSaveState {
    const current = this.load();
    if (!current.badges.includes(badgeId)) {
      current.badges.push(badgeId);
      this.save(current);
    }
    return current;
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
