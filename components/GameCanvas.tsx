
import React, { useRef, useEffect, useState } from 'react';
import { GameState, PowerUpType } from '../types';
import { TILE_SIZE, PHYSICS, COLORS, ASSET_PATHS } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setHealth: React.Dispatch<React.SetStateAction<number>>;
  currentLevel: number;
}

interface Collectible {
  x: number;
  y: number;
  collected: boolean;
  type: 'DOOKIE' | 'POWERUP_FIRE' | 'POWERUP_JUMP' | 'HEAL';
}

type EnemyBehavior = 'WALK' | 'FLY' | 'BOUNCE' | 'DASH' | 'JUMP';

interface Enemy {
  x: number;
  y: number;
  startX: number;
  endX: number;
  startY: number;
  width: number;
  height: number;
  velX: number;
  velY: number;
  alive: boolean;
  type: number;
  behavior: EnemyBehavior;
  timer: number;
}

interface Fireball {
  x: number;
  y: number;
  velX: number;
  active: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, setScore, setHealth, currentLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeKeys = useRef<Set<string>>(new Set());
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  
  const playerRef = useRef({
    pos: { x: 100, y: 350 },
    vel: { x: 0, y: 0 },
    size: { x: 64, y: 64 },
    hitbox: { width: 38, height: 58 }, 
    stamina: 100,
    onGround: false,
    facing: 'RIGHT' as 'LEFT' | 'RIGHT' | 'FORWARD' | 'BACK',
    invulnerable: 0,
    jumpCount: 0,
    powerup: 'NONE' as PowerUpType,
    coyoteTime: 0,
    animFrame: 0
  });
  
  const cameraRef = useRef({ x: 0, y: 0 });
  const levelMap = useRef<number[][]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const fireballsRef = useRef<Fireball[]>([]);
  const goalRef = useRef({ x: 0, y: 0, width: 80, height: 200 });

  useEffect(() => {
    const assetList: Record<string, string> = {
      p_fwd: ASSET_PATHS.PLAYER.FORWARD,
      p_back: ASSET_PATHS.PLAYER.BACK,
      p_left: ASSET_PATHS.PLAYER.LEFT,
      p_right: ASSET_PATHS.PLAYER.RIGHT,
      tile_floor: ASSET_PATHS.TILES.FLOOR,
      tile_obs: ASSET_PATHS.TILES.OBSTACLE,
      dookie: ASSET_PATHS.COLLECTIBLES.DOOKIE,
      powerup: ASSET_PATHS.COLLECTIBLES.POWERUP,
      heal: ASSET_PATHS.COLLECTIBLES.HEAL,
      bg_l1: ASSET_PATHS.BACKGROUNDS.LEVEL1,
      bg_l2: ASSET_PATHS.BACKGROUNDS.LEVEL2,
      bg_l3: ASSET_PATHS.BACKGROUNDS.LEVEL3,
      bg_l4: ASSET_PATHS.BACKGROUNDS.LEVEL4,
      bg_l5: ASSET_PATHS.BACKGROUNDS.LEVEL5,
      e1_l: ASSET_PATHS.ENEMIES.E1_L, e1_r: ASSET_PATHS.ENEMIES.E1_R,
      e2_l: ASSET_PATHS.ENEMIES.E2_L, e2_r: ASSET_PATHS.ENEMIES.E2_R,
      e3_l: ASSET_PATHS.ENEMIES.E3_L, e3_r: ASSET_PATHS.ENEMIES.E3_R,
      e4_l: ASSET_PATHS.ENEMIES.E4_L, e4_r: ASSET_PATHS.ENEMIES.E4_R,
      e5_l: ASSET_PATHS.ENEMIES.E5_L, e5_r: ASSET_PATHS.ENEMIES.E5_R,
    };
    const loaded: Record<string, HTMLImageElement> = {};
    let count = 0;
    const entries = Object.entries(assetList);
    entries.forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onload = () => { loaded[key] = img; count++; if (count === entries.length) setImages(loaded); };
      img.onerror = () => { count++; if (count === entries.length) setImages(loaded); };
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const rows = 24; 
    const cols = 500 + (currentLevel * 150); 
    const map = Array(rows).fill(0).map(() => Array(cols).fill(0));
    const groundY = rows - 5; 
    
    let collectibles: Collectible[] = [];
    let enemies: Enemy[] = [];
    const validPositions: {x: number, y: number, platformXRange: [number, number]}[] = [];

    // Helper to generate a platform island
    const spawnPlatform = (startX: number, row: number, minW: number, maxW: number) => {
      const width = minW + Math.floor(Math.random() * (maxW - minW));
      for (let i = 0; i < width; i++) {
        if (startX + i < cols) {
          map[row][startX + i] = 1;
          validPositions.push({
            x: (startX + i) * TILE_SIZE, 
            y: (row - 1) * TILE_SIZE,
            platformXRange: [startX * TILE_SIZE, (startX + width - 1) * TILE_SIZE]
          });
        }
      }
      return width;
    };

    // Level Generation Loop
    let cursor = 0;
    // Starting safety area
    cursor += spawnPlatform(0, groundY, 25, 30);
    
    while (cursor < cols - 60) {
      const gap = 4 + Math.floor(Math.random() * 6); // 3-8 tiles gap
      cursor += gap;
      
      // Randomly choose verticality
      const roll = Math.random();
      if (roll > 0.4) {
        // Main Ground platform
        const pWidth = spawnPlatform(cursor, groundY, 10, 25);
        
        // Optional Mid-air platforms above this ground
        if (Math.random() > 0.5) {
          spawnPlatform(cursor + 2, groundY - 6, 8, 15);
          if (Math.random() > 0.5) {
            spawnPlatform(cursor + 5, groundY - 12, 12, 18);
          }
        }
        cursor += pWidth;
      } else if (roll > 0.1) {
        // High platform jump only (No ground)
        const pWidth = spawnPlatform(cursor, groundY - 5, 10, 16);
        if (Math.random() > 0.6) {
          spawnPlatform(cursor + 2, groundY - 11, 8, 14);
        }
        cursor += pWidth;
      } else {
        // Floating Shrine (highest layer)
        const pWidth = spawnPlatform(cursor, groundY - 4, 6, 10);
        spawnPlatform(cursor + 1, groundY - 10, 5, 9);
        spawnPlatform(cursor + 2, groundY - 16, 4, 8);
        cursor += pWidth;
      }
    }

    // Guaranteed End Island - Starts at cursor and extends to the very end
    const endStart = cursor + 5;
    spawnPlatform(endStart, groundY, cols - endStart, cols - endStart + 1);

    // Filter valid positions to spawn items and enemies
    const shuffled = validPositions.sort(() => Math.random() - 0.5);
    
    // Items
    const dookieCount = 15 + (currentLevel * 5);
    for (let i = 0; i < dookieCount && shuffled.length > 0; i++) { 
      const p = shuffled.pop()!; 
      collectibles.push({ x: p.x + 8, y: p.y - 10, collected: false, type: 'DOOKIE' }); 
    }
    
    const extras: ('POWERUP_FIRE' | 'POWERUP_JUMP' | 'HEAL')[] = ['POWERUP_FIRE', 'POWERUP_JUMP', 'HEAL', 'HEAL'];
    extras.forEach(type => { if (shuffled.length > 0) { const p = shuffled.pop()!; collectibles.push({ x: p.x, y: p.y, collected: false, type }); } });

    // Enemies - Spawn on stable platforms only
    shuffled.forEach((p, idx) => {
      // Don't spawn enemies right on the goal platform if it's too close to the gate
      if (idx % 12 === 0 && Math.random() > 0.7 && p.x > 500 && p.x < (cols - 40) * TILE_SIZE) {
        const eType = Math.min(5, Math.floor(Math.random() * currentLevel) + 1);
        let behavior: EnemyBehavior = 'WALK';
        
        // Find exact top of tile
        const floorYIndex = Math.floor((p.y + TILE_SIZE) / TILE_SIZE);
        const ey = (floorYIndex * TILE_SIZE) - 48; // Sit on floor (enemy height 48)

        if (eType === 3) behavior = 'FLY';
        if (eType === 4) behavior = 'BOUNCE';
        if (eType === 5) behavior = 'JUMP';

        enemies.push({ 
          x: p.x, 
          y: behavior === 'FLY' ? ey - 100 : ey, 
          startX: p.platformXRange[0],
          endX: p.platformXRange[1],
          startY: ey, 
          width: 48, 
          height: 48, 
          velX: -PHYSICS.ENEMY_SPEED * (0.8 + Math.random() * 0.5), 
          velY: 0, 
          alive: true, 
          type: eType, 
          behavior, 
          timer: 0 
        });
      }
    });

    levelMap.current = map; 
    collectiblesRef.current = collectibles; 
    enemiesRef.current = enemies; 
    fireballsRef.current = [];
    // The gate is placed exactly on the final platform at the very end
    goalRef.current = { x: (cols - 10) * TILE_SIZE, y: (groundY - 12) * TILE_SIZE, width: 140, height: TILE_SIZE * 12 };
    playerRef.current.pos = { x: 100, y: (groundY - 1) * TILE_SIZE - 64 }; 
    playerRef.current.vel = { x: 0, y: 0 }; 
    cameraRef.current.x = 0;
  }, [currentLevel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase(); activeKeys.current.add(key);
      if (key === 'p') setGameState(prev => prev === GameState.PAUSED ? GameState.PLAYING : GameState.PAUSED);
      if (gameState === GameState.PLAYING && (key === 'f' || key === 'enter')) {
        const p = playerRef.current; if (p.powerup === 'FIREBALL') fireballsRef.current.push({ x: p.pos.x + p.size.x / 2, y: p.pos.y + p.size.y / 2, velX: p.facing === 'LEFT' ? -PHYSICS.FIREBALL_SPEED : PHYSICS.FIREBALL_SPEED, active: true });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => activeKeys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    
    let lastTime = performance.now(), frameId: number;
    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.032); 
      lastTime = time;
      if (gameState === GameState.PLAYING) update(dt);
      draw();
      frameId = requestAnimationFrame(loop);
    };

    const update = (dt: number) => {
      const p = playerRef.current, keys = activeKeys.current; 
      if (p.invulnerable > 0) p.invulnerable -= dt; p.animFrame += dt * 10;
      
      const moveLeft = keys.has('a') || keys.has('arrowleft'), moveRight = keys.has('d') || keys.has('arrowright'), jumpTrigger = keys.has(' ') || keys.has('w') || keys.has('arrowup'), sprint = keys.has('shift');
      const isSprinting = sprint && (moveLeft || moveRight) && p.stamina > 2;
      
      if (isSprinting) p.stamina -= PHYSICS.STAMINA_DECAY * dt; 
      else p.stamina = Math.min(100, p.stamina + PHYSICS.STAMINA_REGEN * dt);
      
      let moveDir = 0; if (moveRight) moveDir += 1; if (moveLeft) moveDir -= 1;
      if (moveDir !== 0) { 
        p.vel.x += moveDir * (p.onGround ? PHYSICS.ACCELERATION : PHYSICS.ACCELERATION * PHYSICS.AIR_CONTROL) * dt; 
        p.facing = moveDir > 0 ? 'RIGHT' : 'LEFT'; 
      } else { 
        p.vel.x -= p.vel.x * PHYSICS.FRICTION * (dt * 60); 
      }
      
      const limit = isSprinting ? PHYSICS.SPRINT_SPEED : PHYSICS.PLAYER_SPEED; 
      if (Math.abs(p.vel.x) > limit) p.vel.x = Math.sign(p.vel.x) * limit;
      
      let grav = PHYSICS.GRAVITY; 
      if (p.vel.y > 0) grav *= PHYSICS.FALL_MULTIPLIER; 
      else if (p.vel.y < 0 && !jumpTrigger) grav *= PHYSICS.LOW_JUMP_MULTIPLIER;
      
      p.vel.y += grav * dt; 
      if (p.vel.y > PHYSICS.TERMINAL_VELOCITY) p.vel.y = PHYSICS.TERMINAL_VELOCITY;

      p.coyoteTime -= dt; 
      if (jumpTrigger) {
        if (p.onGround || p.coyoteTime > 0) { 
          p.vel.y = PHYSICS.JUMP_FORCE; 
          p.onGround = false; 
          p.jumpCount = 1; 
          p.coyoteTime = 0; 
        } else if (p.jumpCount < (p.powerup === 'DOUBLE_JUMP' ? 2 : 1) && !keys.has('_jumped')) { 
          p.vel.y = PHYSICS.JUMP_FORCE * 0.9; 
          p.jumpCount++; 
          keys.add('_jumped'); 
        }
      } else { 
        keys.delete('_jumped'); 
        if (p.vel.y < PHYSICS.MIN_JUMP_FORCE) p.vel.y = PHYSICS.MIN_JUMP_FORCE; 
      }

      // X Movement
      p.pos.x += p.vel.x * dt; 
      if (p.pos.x < cameraRef.current.x) { p.pos.x = cameraRef.current.x; p.vel.x = 0; } 
      checkCollisions(true);

      // Y Movement
      p.pos.y += p.vel.y * dt; 
      const wasOnGround = p.onGround; 
      p.onGround = false; 
      checkCollisions(false); 
      if (wasOnGround && !p.onGround) p.coyoteTime = 0.15;

      // Enemy logic
      enemiesRef.current.forEach(e => {
        if (!e.alive) return;
        
        if (e.behavior === 'FLY') {
          e.y = e.startY - 100 + Math.sin(p.animFrame * 0.08) * 60;
        } else if (e.behavior === 'BOUNCE') { 
          e.velY += PHYSICS.GRAVITY * dt; 
          e.y += e.velY * dt; 
          const ty = Math.floor((e.y + e.height) / TILE_SIZE); 
          const txCenter = Math.floor((e.x + e.width/2) / TILE_SIZE);
          if (levelMap.current[ty]?.[txCenter] === 1) { 
            e.y = ty * TILE_SIZE - e.height; 
            e.velY = -400; 
          } 
        }
        
        e.x += e.velX * dt; 
        
        // Edge detection to stay on platform
        if (e.behavior !== 'FLY') {
          const checkX = e.velX > 0 ? e.x + e.width : e.x;
          if (checkX > e.endX || checkX < e.startX) {
            e.velX *= -1;
            e.x = e.velX > 0 ? e.startX : e.endX - e.width;
          }
        } else {
           // Flyers just bounce horizontally after some distance
           if (Math.abs(e.x - e.startX) > 300) e.velX *= -1;
        }

        // Collision with player
        if (p.pos.x < e.x + e.width && p.pos.x + p.size.x > e.x && p.pos.y < e.y + e.height && p.pos.y + p.size.y > e.y) {
          if (p.vel.y > 150) { 
            e.alive = false; 
            p.vel.y = PHYSICS.JUMP_FORCE * 0.6; 
            setScore(s => s + 50); 
          } else {
            handleDamage();
          }
        }
      });

      fireballsRef.current.forEach(f => { if (f.active) { f.x += f.velX * dt; enemiesRef.current.forEach(e => { if (e.alive && f.x > e.x && f.x < e.x + e.width && f.y > e.y && f.y < e.y + e.height) { e.alive = false; f.active = false; setScore(s => s + 25); } }); if (Math.abs(f.x - p.pos.x) > dims.w * 1.5) f.active = false; } });
      collectiblesRef.current.forEach(c => { if (!c.collected && p.pos.x < c.x + 32 && p.pos.x + p.size.x > c.x && p.pos.y < c.y + 32 && p.pos.y + p.size.y > c.y) { c.collected = true; if (c.type === 'DOOKIE') setScore(s => s + 10); else if (c.type === 'HEAL') setHealth(h => Math.min(3, h + 1)); else p.powerup = c.type === 'POWERUP_FIRE' ? 'FIREBALL' : 'DOUBLE_JUMP'; } });
      
      if (p.pos.x > goalRef.current.x + 40) setGameState(GameState.LEVEL_COMPLETE); 
      if (p.pos.y > dims.h + 500) handleDamage(); 

      cameraRef.current.x += (Math.max(cameraRef.current.x, p.pos.x - dims.w * 0.35) - cameraRef.current.x) * 0.1;
    };

    const checkCollisions = (isX: boolean) => {
      const p = playerRef.current; 
      const hWidth = p.hitbox.width, hHeight = p.hitbox.height;
      const hx = p.pos.x + (p.size.x - hWidth) / 2;
      const hy = p.pos.y + (p.size.y - hHeight);

      const startX = isX ? Math.floor(hx / TILE_SIZE) : Math.floor((hx + 2) / TILE_SIZE);
      const endX = isX ? Math.floor((hx + hWidth) / TILE_SIZE) : Math.floor((hx + hWidth - 2) / TILE_SIZE);
      const startY = isX ? Math.floor((hy + 4) / TILE_SIZE) : Math.floor(hy / TILE_SIZE);
      const endY = isX ? Math.floor((hy + hHeight - 4) / TILE_SIZE) : Math.floor((hy + hHeight) / TILE_SIZE);

      for (let r = startY; r <= endY; r++) { 
        for (let c = startX; c <= endX; c++) { 
          if (levelMap.current[r]?.[c] === 1) { 
            const tx = c * TILE_SIZE, ty = r * TILE_SIZE; 
            if (isX) { 
              if (p.vel.x > 0) p.pos.x = tx - hWidth - (p.size.x - hWidth) / 2;
              else if (p.vel.x < 0) p.pos.x = tx + TILE_SIZE - (p.size.x - hWidth) / 2;
              p.vel.x = 0; 
            } else { 
              if (p.vel.y > 0) { 
                p.pos.y = ty - p.size.y; 
                p.onGround = true; 
                p.vel.y = 0; 
                p.jumpCount = 0; 
              } else if (p.vel.y < 0) { 
                p.pos.y = ty + TILE_SIZE - (p.size.y - hHeight); 
                p.vel.y = 0; 
              } 
            } 
          } 
        } 
      }
    };

    const handleDamage = () => { 
      const p = playerRef.current; 
      if (p.invulnerable > 0) return; 
      setHealth(h => { if (h <= 1) { setGameState(GameState.GAME_OVER); return 0; } return h - 1; }); 
      p.pos.x = Math.max(cameraRef.current.x, 100); 
      p.pos.y = -200; // Reset from sky to fall back in
      p.vel = { x: 0, y: 0 }; 
      p.invulnerable = 2.0; 
    };

    const draw = () => {
      const canvas = canvasRef.current, ctx = canvas?.getContext('2d'); 
      if (!ctx || !canvas) return;
      const camX = cameraRef.current.x, p = playerRef.current; 
      ctx.clearRect(0, 0, dims.w, dims.h);

      const bgImg = images[`bg_l${currentLevel}`]; 
      if (bgImg) { 
        const px = -(camX * 0.4) % dims.w; 
        ctx.drawImage(bgImg, px, 0, dims.w, dims.h); 
        ctx.drawImage(bgImg, px + dims.w, 0, dims.w, dims.h); 
      } else {
        ctx.fillStyle = COLORS.LIGHT_BLUE; 
        ctx.fillRect(0, 0, dims.w, dims.h);
      }

      const map = levelMap.current; 
      for (let r = 0; r < map.length; r++) { 
        for (let c = 0; c < map[r].length; c++) { 
          if (map[r][c] === 1) { 
            const x = c * TILE_SIZE - camX; 
            if (x < -TILE_SIZE || x > dims.w) continue; 
            const tImg = images.tile_floor; 
            if (tImg) ctx.drawImage(tImg, x, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
            else { ctx.fillStyle = COLORS.GREEN; ctx.fillRect(x, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); } 
          } 
        } 
      }

      // Draw Torii Gate at Goal
      const g = goalRef.current, gx = g.x - camX; 
      // Main structure
      ctx.fillStyle = COLORS.TORII_RED; 
      ctx.fillRect(gx, g.y, 24, g.height); 
      ctx.fillRect(gx + g.width - 24, g.y, 24, g.height); 
      // Top beams
      ctx.fillRect(gx - 20, g.y + 15, g.width + 40, 36);
      ctx.fillRect(gx - 10, g.y + 60, g.width + 20, 24);
      // Base
      ctx.fillStyle = COLORS.BLACK;
      ctx.fillRect(gx - 4, g.y + g.height - 10, 32, 10);
      ctx.fillRect(gx + g.width - 28, g.y + g.height - 10, 32, 10);

      fireballsRef.current.forEach(f => { if (f.active) { ctx.fillStyle = COLORS.FIRE; ctx.beginPath(); ctx.arc(f.x - camX, f.y, 16, 0, Math.PI*2); ctx.fill(); } });
      
      collectiblesRef.current.forEach(c => { 
        if (!c.collected) { 
          const cx = c.x - camX, itemImg = c.type === 'DOOKIE' ? images.dookie : c.type === 'HEAL' ? images.heal : images.powerup; 
          if (itemImg) ctx.drawImage(itemImg, cx, c.y, 36, 36); 
          else { ctx.font = '38px serif'; ctx.fillText(c.type === 'DOOKIE' ? '💩' : c.type === 'HEAL' ? '❤️' : '⚡', cx, c.y + 34); } 
        } 
      });
      
      enemiesRef.current.forEach(e => { 
        if (e.alive) { 
          const ex = e.x - camX;
          const isRight = e.velX > 0;
          const eImg = isRight ? images[`e${e.type}_r`] : images[`e${e.type}_l`];
          const altImg = isRight ? images[`e${e.type}_l`] : images[`e${e.type}_r`]; 
          if (eImg) {
            ctx.drawImage(eImg, ex, e.y, e.width, e.height);
          } else if (altImg) {
            ctx.save();
            ctx.translate(ex + e.width / 2, e.y + e.height / 2);
            ctx.scale(isRight ? -1 : 1, 1);
            ctx.drawImage(altImg, -e.width / 2, -e.height / 2, e.width, e.height);
            ctx.restore();
          } else { 
            ctx.fillStyle = 'red'; 
            ctx.fillRect(ex, e.y, e.width, e.height); 
          }
        } 
      });
      
      const pImg = p.facing === 'LEFT' ? images.p_left : images.p_right;
      if (pImg) { 
        ctx.save(); 
        if (p.invulnerable > 0 && Math.floor(p.invulnerable * 10) % 2 === 0) ctx.globalAlpha = 0.3; 
        ctx.drawImage(pImg, p.pos.x - camX, p.pos.y, p.size.x, p.size.y); 
        ctx.restore(); 
      } else { ctx.fillStyle = COLORS.PINK; ctx.fillRect(p.pos.x - camX, p.pos.y, p.size.x, p.size.y); }
    };

    loop(performance.now());
    return () => { cancelAnimationFrame(frameId); window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [gameState, dims, images, currentLevel]);

  return <canvas ref={canvasRef} width={dims.w} height={dims.h} className="block w-full h-full" />;
};

export default GameCanvas;
