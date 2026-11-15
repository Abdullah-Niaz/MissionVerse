import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createPhaserGame } from '../game/config';
import { PlanetEnvironment } from '../types';

interface Props {
  planet: PlanetEnvironment;
  avatarId: string;
}

export const PhaserGame: React.FC<Props> = ({ planet, avatarId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (gameRef.current) return; // Prevent duplicate WebGL instances

    const container = containerRef.current;

    // Use requestAnimationFrame to ensure the div is painted and has real dimensions
    const raf = requestAnimationFrame(() => {
      const clientWidth = container.clientWidth || window.innerWidth || 1280;
      const clientHeight = container.clientHeight || window.innerHeight || 720;

      const game = createPhaserGame(
        container,
        planet,
        avatarId,
        clientWidth,
        clientHeight
      );
      gameRef.current = game;
    });

    return () => {
      cancelAnimationFrame(raf);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [planet, avatarId]);

  return (
    <div
      ref={containerRef}
      id="phaser-game-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0,
        cursor: 'crosshair',
        backgroundColor: planet === 'moon' ? '#1e293b' : '#7c2d12',
      }}
    />
  );
};
