import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AvatarSelect } from './components/AvatarSelect';
import { PlanetSelect } from './components/PlanetSelect';
import { PhaserGame } from './components/PhaserGame';
import { HUD } from './components/HUD';
import { VirtualJoystick } from './components/VirtualJoystick';
import { DiscoveryModal } from './components/DiscoveryModal';
import { MentorModal } from './components/MentorModal';
import { NASAModal } from './components/NASAModal';
import { JournalModal } from './components/JournalModal';
import { MissionCompleteModal } from './components/MissionCompleteModal';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { eventBridge } from './game/EventBridge';
import { PlanetEnvironment, AvatarOption, Mission, ResourceState, GuestSaveState } from './types';
import { sound } from './utils/audio';

type ScreenState = 'welcome' | 'avatar_select' | 'planet_select' | 'gameplay';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [savedData, setSavedData] = useState<GuestSaveState | null>(null);

  // Player State
  const [avatarId, setAvatarId] = useState<string>('nova');
  const [callsign, setCallsign] = useState<string>('Astronaut Nova');
  const [planet, setPlanet] = useState<PlanetEnvironment>('moon');

  // Gameplay State
  const [resources, setResources] = useState<ResourceState>({
    oxygen: 100,
    energy: 100,
    battery: 100,
    samples: 0
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentMissionIdx, setCurrentMissionIdx] = useState<number>(0);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [inRover, setInRover] = useState<boolean>(false);
  const [proximityObject, setProximityObject] = useState<{ objectId: string; name: string; isRecharge?: boolean } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Modals
  const [inspectingObjectId, setInspectingObjectId] = useState<string | null>(null);
  const [mentorOpen, setMentorOpen] = useState<boolean>(false);
  const [mentorTopic, setMentorTopic] = useState<string | undefined>(undefined);
  const [nasaOpen, setNasaOpen] = useState<boolean>(false);
  const [journalOpen, setJournalOpen] = useState<boolean>(false);
  const [completedMissionAward, setCompletedMissionAward] = useState<Mission | null>(null);

  // Load existing save on boot
  useEffect(() => {
    const loaded = StorageService.load();
    if (loaded && loaded.player) {
      setSavedData(loaded);
      setAvatarId(loaded.player.avatarId);
      setCallsign(loaded.player.name);
      setPlanet(loaded.player.selectedPlanet);
      setResources(loaded.resources);
      setCompletedMissionIds(loaded.completedMissions);
      setCurrentMissionIdx(loaded.currentMissionIndex || 0);
      setDiscoveries(loaded.discoveries || []);
      setBadges(loaded.badges || []);
    }
  }, []);

  // Listen to EventBridge
  useEffect(() => {
    const unsubProximityEnter = eventBridge.on('PROXIMITY_ENTER', (data) => {
      setProximityObject(data as { objectId: string; name: string; isRecharge?: boolean });
    });

    const unsubProximityExit = eventBridge.on('PROXIMITY_EXIT', () => {
      setProximityObject(null);
    });

    const unsubInspect = eventBridge.on('INSPECT_OBJECT', (data) => {
      const obj = data as { objectId: string };
      setInspectingObjectId(obj.objectId);
      sound.playInspect();
    });

    const unsubResource = eventBridge.on('RESOURCE_UPDATED', (data) => {
      const res = data as Partial<ResourceState>;
      setResources((prev) => {
        const next = { ...prev, ...res };
        StorageService.updateResources(next);
        return next;
      });
    });

    const unsubRover = eventBridge.on('ROVER_TOGGLED', (data) => {
      const { inRover } = data as { inRover: boolean };
      setInRover(inRover);
    });

    const unsubToast = eventBridge.on('SHOW_TOAST', (data) => {
      const { message } = data as { message: string };
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3500);
    });

    const unsubObjective = eventBridge.on('OBJECTIVE_COMPLETED', (data) => {
      const { target } = data as { target: string };
      handleCheckObjective(target);
    });

    return () => {
      unsubProximityEnter();
      unsubProximityExit();
      unsubInspect();
      unsubResource();
      unsubRover();
      unsubToast();
      unsubObjective();
    };
  }, [currentMissionIdx, missions, completedObjectives]);

  // Load missions when planet changes
  useEffect(() => {
    ApiService.fetchMissions(planet).then((list) => {
      setMissions(list);
    });
  }, [planet]);

  const handleStartNew = () => {
    setScreen('avatar_select');
  };

  const handleResume = () => {
    if (savedData) {
      setScreen('gameplay');
    }
  };

  const handleAvatarConfirm = (avatar: AvatarOption, name: string) => {
    setAvatarId(avatar.id);
    setCallsign(name);
    setScreen('planet_select');
  };

  const handlePlanetSelect = (p: PlanetEnvironment) => {
    setPlanet(p);
    // Reset mission index for new planet
    setCurrentMissionIdx(0);
    setCompletedObjectives([]);
    
    // Save updated profile
    const currentSave = StorageService.load();
    currentSave.player = {
      avatarId,
      name: callsign,
      selectedPlanet: p
    };
    StorageService.save(currentSave);

    setScreen('gameplay');
  };

  const currentMission = missions[currentMissionIdx];

  const handleCheckObjective = (targetName: string) => {
    if (!currentMission) return;
    const matched = currentMission.objectives.find(
      (obj) => obj.target === targetName && !completedObjectives.includes(obj.id)
    );

    if (matched) {
      sound.playInspect();
      const updated = [...completedObjectives, matched.id];
      setCompletedObjectives(updated);

      // Check if all objectives complete
      const allDone = currentMission.objectives.every((obj) => updated.includes(obj.id));
      if (allDone) {
        // Award badge & trigger evaluation modal
        const newBadges = badges.includes(currentMission.completion_badge)
          ? badges
          : [...badges, currentMission.completion_badge];
        setBadges(newBadges);

        const newCompletedMissions = completedMissionIds.includes(currentMission.id)
          ? completedMissionIds
          : [...completedMissionIds, currentMission.id];
        setCompletedMissionIds(newCompletedMissions);

        // Persist
        const save = StorageService.load();
        save.badges = newBadges;
        save.completedMissions = newCompletedMissions;
        StorageService.save(save);

        setCompletedMissionAward(currentMission);
      }
    }
  };

  const handleNextMission = () => {
    setCompletedMissionAward(null);
    setCompletedObjectives([]);
    if (currentMissionIdx + 1 < missions.length) {
      setCurrentMissionIdx(currentMissionIdx + 1);
      const save = StorageService.load();
      save.currentMissionIndex = currentMissionIdx + 1;
      StorageService.save(save);
    } else {
      setToastMessage('🎉 All missions completed for this planet! You are a master explorer!');
    }
  };

  const handleLogDiscovery = (id: string) => {
    const updated = StorageService.addDiscovery(id);
    setDiscoveries(updated.discoveries);
    setResources((prev) => {
      const next = { ...prev, samples: prev.samples + 1 };
      StorageService.updateResources(next);
      return next;
    });
    setInspectingObjectId(null);
    setToastMessage(`🔬 Logged discovery: ${id.replace(/_/g, ' ')} (+1 Sample)`);
  };

  const handleOpenMentorWithTopic = (topic: string) => {
    setInspectingObjectId(null);
    setMentorTopic(topic);
    setMentorOpen(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {screen === 'welcome' && (
        <WelcomeScreen
          onStart={handleStartNew}
          onResume={savedData ? handleResume : undefined}
          savedName={savedData?.player.name}
          savedPlanet={savedData?.player.selectedPlanet}
        />
      )}

      {screen === 'avatar_select' && (
        <AvatarSelect
          initialAvatarId={avatarId}
          initialName={callsign}
          onConfirm={handleAvatarConfirm}
          onBack={() => setScreen('welcome')}
        />
      )}

      {screen === 'planet_select' && (
        <PlanetSelect
          initialPlanet={planet}
          onSelect={handlePlanetSelect}
          onBack={() => setScreen('avatar_select')}
        />
      )}

      {screen === 'gameplay' && (
        <div className="relative w-full h-full">
          {/* Phaser 2D Canvas */}
          <PhaserGame planet={planet} avatarId={avatarId} />

          {/* Interactive HUD */}
          <HUD
            callsign={callsign}
            planet={planet}
            resources={resources}
            currentMission={currentMission}
            completedObjectives={completedObjectives}
            proximityObject={proximityObject}
            inRover={inRover}
            onOpenMentor={() => { setMentorTopic(undefined); setMentorOpen(true); }}
            onOpenJournal={() => setJournalOpen(true)}
            onOpenNASA={() => setNasaOpen(true)}
            onInteract={() => eventBridge.emit('INTERACT_TRIGGERED')}
            onExit={() => setScreen('welcome')}
            toastMessage={toastMessage}
          />

          {/* Mobile Virtual Joystick */}
          <VirtualJoystick />

          {/* Discovery Card Modal */}
          {inspectingObjectId && (
            <DiscoveryModal
              objectId={inspectingObjectId}
              onClose={() => setInspectingObjectId(null)}
              onLogDiscovery={handleLogDiscovery}
              onAskMentor={handleOpenMentorWithTopic}
            />
          )}

          {/* AI Mentor AstroGuide Modal */}
          {mentorOpen && (
            <MentorModal
              planet={planet}
              missionId={currentMission?.id || 'moon_001'}
              initialTopic={mentorTopic}
              onClose={() => setMentorOpen(false)}
            />
          )}

          {/* NASA Data Terminal */}
          {nasaOpen && (
            <NASAModal onClose={() => setNasaOpen(false)} />
          )}

          {/* Discovery Journal */}
          {journalOpen && (
            <JournalModal
              badges={badges}
              discoveries={discoveries}
              samplesCount={resources.samples}
              onClose={() => setJournalOpen(false)}
            />
          )}

          {/* Mission Complete Celebration */}
          {completedMissionAward && (
            <MissionCompleteModal
              mission={completedMissionAward}
              onNextMission={handleNextMission}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
