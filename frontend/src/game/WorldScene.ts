import Phaser from 'phaser';
import { createGameTextures } from './textures';
import { eventBridge } from './EventBridge';
import { PlanetEnvironment } from '../types';

export interface WorldSceneData {
  planet: PlanetEnvironment;
  avatarId: string;
}

interface Landmark {
  id: string;
  name: string;
  texture: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isRecharge?: boolean;
}

export class WorldScene extends Phaser.Scene {
  public planet: PlanetEnvironment = 'moon';
  public avatarId: string = 'nova';
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    Space: Phaser.Input.Keyboard.Key;
  };
  private landmarks: Landmark[] = [];
  private activeLandmark: Landmark | null = null;
  private inRover: boolean = false;
  private touchVelocity = { x: 0, y: 0 };
  private oxygen: number = 100;
  private energy: number = 100;
  private battery: number = 100;
  private lastResourceTick: number = 0;

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data?: WorldSceneData) {
    if (data?.planet) this.planet = data.planet;
    if (data?.avatarId) this.avatarId = data.avatarId;
    this.inRover = false;
    this.oxygen = 100;
    this.energy = 100;
    this.battery = 100;
    this.landmarks = [];
    this.activeLandmark = null;
    this.touchVelocity = { x: 0, y: 0 };
    this.lastResourceTick = 0;
  }

  preload() {
    try {
      createGameTextures(this);
    } catch (err) {
      console.error('[WorldScene] preload error:', err);
    }
  }

  create() {
    try {
      const mapWidth = 2400;
      const mapHeight = 2400;
      this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

      // Draw background terrain
      this.drawTerrain(mapWidth, mapHeight);

      // Setup landmarks based on environment
      this.setupLandmarks();

      // Create player at landing site
      const spawnX = 1200;
      const spawnY = 1260;
      this.player = this.physics.add.sprite(spawnX, spawnY, 'astronaut_idle');
      this.player.setCollideWorldBounds(true);
      this.player.setDepth(20);
      this.player.setSize(28, 28);
      this.player.setOffset(10, 14);

      // Camera setup
      this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1.1);
      this.cameras.main.fadeIn(400, 0, 0, 0);

      // Keyboard controls
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = {
          W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
          D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
          E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
          Space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        this.wasdKeys.E.on('down', () => this.triggerInteraction());
        this.wasdKeys.Space.on('down', () => this.triggerInteraction());
      }

      // Event bridge listeners for touch controls and UI events
      eventBridge.on('INPUT_MOVE', (data) => {
        const vec = data as { x: number; y: number };
        this.touchVelocity = vec;
      });

      eventBridge.on('INTERACT_TRIGGERED', () => {
        this.triggerInteraction();
      });

      eventBridge.on('RECHARGE_TRIGGERED', () => {
        this.oxygen = 100;
        this.battery = 100;
        this.energy = 100;
        eventBridge.emit('RESOURCE_UPDATED', {
          oxygen: this.oxygen,
          energy: this.energy,
          battery: this.battery
        });
      });

      // Particle dust drift — wrapped safely
      this.setupParticles();

      // Notify React that scene is ready
      eventBridge.emit('SCENE_READY', { planet: this.planet });

    } catch (err) {
      console.error('[WorldScene] create() error:', err);
    }
  }

  private drawTerrain(width: number, height: number) {
    const bgGraphics = this.add.graphics();
    bgGraphics.setDepth(0);

    const isMoon = this.planet === 'moon';
    const baseColor = isMoon ? 0x1e293b : 0x9a3412;
    const craterColor = isMoon ? 0x0f172a : 0x571607;
    const gridColor = isMoon ? 0x334155 : 0x7c2d12;

    // Fill base planetary ground
    bgGraphics.fillStyle(baseColor, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // Grid lines for scientific map coordinate navigation
    bgGraphics.lineStyle(1, gridColor, 0.4);
    for (let x = 0; x < width; x += 120) {
      bgGraphics.beginPath();
      bgGraphics.moveTo(x, 0);
      bgGraphics.lineTo(x, height);
      bgGraphics.strokePath();
    }
    for (let y = 0; y < height; y += 120) {
      bgGraphics.beginPath();
      bgGraphics.moveTo(0, y);
      bgGraphics.lineTo(width, y);
      bgGraphics.strokePath();
    }

    // Landing Zone circular pad
    bgGraphics.fillStyle(isMoon ? 0x334155 : 0x7c2d12, 0.85);
    bgGraphics.fillCircle(1200, 1200, 140);
    bgGraphics.lineStyle(4, isMoon ? 0x60a5fa : 0xf97316, 0.8);
    bgGraphics.strokeCircle(1200, 1200, 140);

    // "LANDING ZONE" text in world space
    this.add.text(1200, 1200, 'LANDING ZONE', {
      fontSize: '14px',
      fontStyle: 'bold',
      color: isMoon ? '#60a5fa' : '#f97316',
    }).setAlpha(0.7).setOrigin(0.5).setDepth(1);

    // Procedural crater/rock impressions across the terrain
    const rand = new Phaser.Math.RandomDataGenerator([isMoon ? 'moon123' : 'mars456']);
    for (let i = 0; i < 50; i++) {
      const cx = rand.between(120, width - 120);
      const cy = rand.between(120, height - 120);
      // Avoid landing center
      if (Phaser.Math.Distance.Between(cx, cy, 1200, 1200) < 220) continue;

      const radius = rand.between(20, 60);
      bgGraphics.fillStyle(craterColor, 0.7);
      bgGraphics.fillCircle(cx, cy, radius);
      bgGraphics.lineStyle(2, isMoon ? 0x64748b : 0xea580c, 0.6);
      bgGraphics.strokeCircle(cx, cy, radius);
    }

    // Extra terrain detail — scattered pebble dots
    for (let i = 0; i < 120; i++) {
      const px = rand.between(0, width);
      const py = rand.between(0, height);
      bgGraphics.fillStyle(isMoon ? 0x475569 : 0xb45309, 0.5);
      bgGraphics.fillCircle(px, py, rand.between(2, 6));
    }
  }

  private setupLandmarks() {
    if (this.planet === 'moon') {
      this.landmarks = [
        { id: 'lunar_lander', name: 'Artemis Lunar Lander', texture: 'lunar_lander', x: 1200, y: 1120, width: 128, height: 128 },
        { id: 'crater_rim', name: 'Shackleton Crater Rim', texture: 'crater_rim', x: 1200, y: 650, width: 160, height: 160 },
        { id: 'regolith_deposit', name: 'Volcanic Regolith Deposit', texture: 'regolith_deposit', x: 1700, y: 1100, width: 96, height: 96 },
        { id: 'solar_array', name: 'Lunar Solar Array', texture: 'solar_array', x: 800, y: 1450, width: 110, height: 80 },
        { id: 'lunar_rover', name: 'Lunar Roving Vehicle', texture: 'lunar_rover', x: 1500, y: 1400, width: 96, height: 72 },
        { id: 'recharge_pod', name: 'Life Support Recharge Pod', texture: 'recharge_pod', x: 1060, y: 1200, width: 64, height: 64, isRecharge: true },
      ];
    } else {
      this.landmarks = [
        { id: 'mars_weather_station', name: 'Meteorological Sensor Alpha', texture: 'mars_weather_station', x: 1200, y: 1130, width: 64, height: 80 },
        { id: 'mars_rock_formation', name: 'Volcanic Basalt Outcrop', texture: 'mars_rock_formation', x: 750, y: 950, width: 96, height: 72 },
        { id: 'ancient_riverbed', name: 'Jezero Ancient Riverbed', texture: 'ancient_riverbed', x: 1700, y: 850, width: 140, height: 90 },
        { id: 'mars_rover', name: 'Mars Exploration Rover', texture: 'mars_rover', x: 1100, y: 1450, width: 110, height: 84 },
        { id: 'mars_habitat_computer', name: 'Atmospheric Habitat Monitor', texture: 'solar_array', x: 1500, y: 1400, width: 110, height: 80 },
        { id: 'recharge_pod', name: 'Martian Habitat Airlock Refill', texture: 'recharge_pod', x: 1340, y: 1120, width: 64, height: 64, isRecharge: true },
      ];
    }

    this.landmarks.forEach((l) => {
      const sprite = this.add.sprite(l.x, l.y, l.texture);
      sprite.setDepth(10);

      // Recharge pod gets a pulsing teal ring
      if (l.isRecharge) {
        this.tweens.add({
          targets: sprite,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      // Label below landmark
      const label = this.add.text(l.x, l.y + l.height / 2 + 14, l.name, {
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#0f172aCC',
        padding: { x: 6, y: 3 }
      });
      label.setOrigin(0.5);
      label.setDepth(12);
    });
  }

  private setupParticles() {
    try {
      const isMoon = this.planet === 'moon';
      // Only attempt if texture exists
      if (!this.textures.exists('interactive_ring')) return;

      const emitter = this.add.particles(0, 0, 'interactive_ring', {
        scale: { start: 0.05, end: 0 },
        alpha: { start: 0.4, end: 0 },
        speed: { min: 8, max: 20 },
        lifespan: 2000,
        frequency: 300,
        tint: isMoon ? 0x93c5fd : 0xf97316
      });
      emitter.setDepth(5);
      emitter.startFollow(this.player);
    } catch (err) {
      console.warn('[WorldScene] Particles not available:', err);
    }
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.player.active) return;

    let vx = 0;
    let vy = 0;
    const baseSpeed = this.inRover ? 260 : (this.planet === 'moon' ? 155 : 175);

    // Keyboard inputs
    if (this.cursors && this.wasdKeys) {
      if (this.cursors.left.isDown || this.wasdKeys.A.isDown) vx -= 1;
      if (this.cursors.right.isDown || this.wasdKeys.D.isDown) vx += 1;
      if (this.cursors.up.isDown || this.wasdKeys.W.isDown) vy -= 1;
      if (this.cursors.down.isDown || this.wasdKeys.S.isDown) vy += 1;
    }

    // Touch controls override or blend
    if (Math.abs(this.touchVelocity.x) > 0.1 || Math.abs(this.touchVelocity.y) > 0.1) {
      vx = this.touchVelocity.x;
      vy = this.touchVelocity.y;
    }

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx = vx / len;
      vy = vy / len;
    }

    this.player.setVelocity(vx * baseSpeed, vy * baseSpeed);

    if (vx !== 0 || vy !== 0) {
      const angle = Math.atan2(vy, vx);
      this.player.setRotation(angle + Math.PI / 2);
    }

    // Proximity check
    this.checkProximity();

    // Resource tick
    this.lastResourceTick += delta;
    if (this.lastResourceTick > 1500) {
      this.lastResourceTick = 0;
      this.tickResources(vx !== 0 || vy !== 0);
    }
  }

  private checkProximity() {
    let closestLandmark: Landmark | null = null;
    let closestDist = 95;

    for (const lm of this.landmarks) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, lm.x, lm.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestLandmark = lm;
      }
    }

    if (closestLandmark !== this.activeLandmark) {
      this.activeLandmark = closestLandmark;
      if (closestLandmark) {
        eventBridge.emit('PROXIMITY_ENTER', {
          objectId: closestLandmark.id,
          name: closestLandmark.name,
          isRecharge: closestLandmark.isRecharge
        });
      } else {
        eventBridge.emit('PROXIMITY_EXIT');
      }
    }
  }

  private triggerInteraction() {
    if (!this.activeLandmark) return;

    if (this.activeLandmark.isRecharge) {
      this.oxygen = 100;
      this.battery = 100;
      this.energy = 100;
      eventBridge.emit('RESOURCE_UPDATED', {
        oxygen: this.oxygen,
        energy: this.energy,
        battery: this.battery
      });
      eventBridge.emit('OBJECTIVE_COMPLETED', { target: this.activeLandmark.id });
      eventBridge.emit('SHOW_TOAST', { message: '🔋 Full Life Support & Battery Recharged!' });
      return;
    }

    if (this.activeLandmark.id === 'mars_rover' || this.activeLandmark.id === 'lunar_rover') {
      this.inRover = !this.inRover;
      eventBridge.emit('ROVER_TOGGLED', { inRover: this.inRover });
      eventBridge.emit('OBJECTIVE_COMPLETED', { target: this.activeLandmark.id });
      eventBridge.emit('SHOW_TOAST', {
        message: this.inRover ? '🚀 Mounted Rover! (+60% Speed)' : 'Astronaut dismounted.'
      });
      return;
    }

    eventBridge.emit('INSPECT_OBJECT', {
      objectId: this.activeLandmark.id,
      name: this.activeLandmark.name,
      planet: this.planet
    });

    eventBridge.emit('OBJECTIVE_COMPLETED', { target: this.activeLandmark.id });
  }

  private tickResources(isMoving: boolean) {
    const o2Burn = isMoving ? 0.35 : 0.15;
    const energyBurn = isMoving ? 0.25 : 0.1;
    const batteryBurn = this.inRover ? 0.4 : 0.1;

    this.oxygen = Math.max(0, this.oxygen - o2Burn);
    this.energy = Math.max(0, this.energy - energyBurn);
    this.battery = Math.max(0, this.battery - batteryBurn);

    eventBridge.emit('RESOURCE_UPDATED', {
      oxygen: Math.round(this.oxygen),
      energy: Math.round(this.energy),
      battery: Math.round(this.battery)
    });

    if (this.oxygen <= 0) {
      this.triggerEmergencyRescue();
    }
  }

  private triggerEmergencyRescue() {
    this.player.setPosition(1200, 1260);
    this.oxygen = 100;
    this.energy = 100;
    this.battery = 100;
    this.inRover = false;
    eventBridge.emit('RESOURCE_UPDATED', { oxygen: 100, energy: 100, battery: 100 });
    eventBridge.emit('SHOW_TOAST', {
      message: '🚁 Emergency Rescue Drone returned you safely to base with full air!'
    });
  }

  shutdown() {
    eventBridge.clear();
  }
}
