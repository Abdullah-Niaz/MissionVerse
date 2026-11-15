import Phaser from 'phaser';
import { WorldScene } from './WorldScene';

export function createPhaserGame(
  parent: HTMLElement,
  planet: 'moon' | 'mars',
  avatarId: string,
  width: number,
  height: number
): Phaser.Game {
  // Guarantee non-zero dimensions to avoid WebGL Incomplete Attachment error
  const safeWidth = Math.max(width, 800);
  const safeHeight = Math.max(height, 600);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: safeWidth,
    height: safeHeight,
    backgroundColor: planet === 'moon' ? '#1e293b' : '#7c2d12',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [WorldScene]
  };

  const game = new Phaser.Game(config);

  // Pass planet + avatarId via scene start AFTER game is created
  game.events.once('ready', () => {
    game.scene.start('WorldScene', { planet, avatarId });
  });

  return game;
}
