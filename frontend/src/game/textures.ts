import Phaser from 'phaser';

// Safe rounded rect helper compatible with all canvas 2D contexts
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function createGameTextures(scene: Phaser.Scene) {
  const textures = scene.textures;

  const makeCanvas = (key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
    if (textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      try {
        draw(ctx);
        textures.addCanvas(key, canvas);
      } catch (err) {
        console.error(`Error drawing procedural texture ${key}:`, err);
      }
    }
  };

  // 1. Astronaut Top-Down Sprite
  makeCanvas('astronaut_idle', 48, 48, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(24, 40, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Life support backpack
    ctx.fillStyle = '#94a3b8';
    drawRoundedRect(ctx, 14, 10, 20, 24, 5);
    ctx.fill();

    // Suit body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(24, 22, 13, 0, Math.PI * 2);
    ctx.fill();

    // Gold tinted visor
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(24, 18, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor gleam
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(22, 16, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Mission badge patch on arm
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(10, 24, 4, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(34, 24, 4, 4);
  });

  // 2. Lunar Lander
  makeCanvas('lunar_lander', 128, 128, (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(64, 105, 54, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Landing legs (struts)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, 60); ctx.lineTo(12, 105);
    ctx.moveTo(93, 60); ctx.lineTo(116, 105);
    ctx.moveTo(50, 70); ctx.lineTo(38, 110);
    ctx.moveTo(78, 70); ctx.lineTo(90, 110);
    ctx.stroke();

    // Footpads
    ctx.fillStyle = '#f59e0b';
    [12, 116, 38, 90].forEach(x => {
      ctx.beginPath();
      ctx.ellipse(x, x === 12 || x === 116 ? 105 : 110, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Descent stage
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(40, 48); ctx.lineTo(88, 48); ctx.lineTo(100, 76); ctx.lineTo(88, 86);
    ctx.lineTo(40, 86); ctx.lineTo(28, 76); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ascent stage
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(64, 38, 22, 0, Math.PI * 2);
    ctx.fill();

    // Windows
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(54, 32); ctx.lineTo(60, 32); ctx.lineTo(56, 38); ctx.closePath();
    ctx.moveTo(74, 32); ctx.lineTo(68, 32); ctx.lineTo(72, 38); ctx.closePath();
    ctx.fill();
  });

  // 3. Shackleton Crater
  makeCanvas('crater_rim', 160, 160, (ctx) => {
    const grad = ctx.createRadialGradient(80, 80, 20, 80, 80, 78);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(0.85, '#334155');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(80, 80, 78, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(80, 80, 58, Math.PI * 0.8, Math.PI * 1.8);
    ctx.stroke();
  });

  // 4. Regolith Deposit
  makeCanvas('regolith_deposit', 96, 96, (ctx) => {
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(48, 48, 42, 28, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    [[35, 42], [55, 38], [42, 58], [62, 52], [48, 32]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // 5. Solar Array
  makeCanvas('solar_array', 110, 80, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(55, 68, 36, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.fillRect(52, 40, 6, 26);

    ctx.fillStyle = '#1d4ed8';
    drawRoundedRect(ctx, 15, 12, 80, 36, 4);
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1;
    for (let x = 30; x <= 80; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 12); ctx.lineTo(x, 48);
      ctx.stroke();
    }
  });

  // 6. Rovers
  makeCanvas('lunar_rover', 96, 72, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(48, 56, 40, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    [[14, 20], [14, 52], [76, 20], [76, 52]].forEach(([x, y]) => {
      ctx.fillRect(x, y, 10, 16);
    });

    ctx.fillStyle = '#f1f5f9';
    drawRoundedRect(ctx, 22, 22, 54, 32, 6);
    ctx.fill();

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(32, 28, 14, 18);
    ctx.fillRect(50, 28, 14, 18);
  });

  makeCanvas('mars_rover', 110, 84, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(55, 68, 48, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#334155';
    [[12, 16], [12, 38], [12, 60], [86, 16], [86, 38], [86, 60]].forEach(([x, y]) => {
      ctx.fillRect(x, y, 12, 14);
    });

    ctx.fillStyle = '#f8fafc';
    drawRoundedRect(ctx, 22, 22, 66, 44, 8);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(36, 30, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(36, 30, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 7. Mars Weather Station
  makeCanvas('mars_weather_station', 64, 80, (ctx) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(32, 40); ctx.lineTo(16, 72);
    ctx.moveTo(32, 40); ctx.lineTo(48, 72);
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.fillRect(30, 16, 4, 30);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(32, 16, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // 8. Mars Rock Formation
  makeCanvas('mars_rock_formation', 96, 72, (ctx) => {
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(15, 60); ctx.lineTo(35, 18); ctx.lineTo(65, 12); ctx.lineTo(85, 45); ctx.lineTo(80, 62); ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });

  // 9. Ancient Riverbed
  makeCanvas('ancient_riverbed', 140, 90, (ctx) => {
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.ellipse(70, 45, 62, 34, -0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(30, 40); ctx.lineTo(65, 48); ctx.lineTo(105, 36);
    ctx.stroke();
  });

  // 10. Recharge Station
  makeCanvas('recharge_pod', 64, 64, (ctx) => {
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    drawRoundedRect(ctx, 16, 16, 32, 36, 6);
    ctx.fill();

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(20, 22, 24, 22);

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(34, 24); ctx.lineTo(28, 33); ctx.lineTo(33, 33); ctx.lineTo(30, 42); ctx.lineTo(37, 31); ctx.lineTo(32, 31); ctx.closePath();
    ctx.fill();
  });

  // 11. Interactive Ring
  makeCanvas('interactive_ring', 64, 64, (ctx) => {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.stroke();
  });
}
