
export const TILE_SIZE = 32;

// Logical dimensions for physics calculations
export const LOGICAL_WIDTH = 800;
export const LOGICAL_HEIGHT = 600;

export const COLORS = {
  PINK: '#FFB7C5',      
  GREEN: '#5D4037',     // Woody brown for structures
  LIGHT_BLUE: '#E0F7FA', 
  WHITE: '#FFFFFF',
  BLACK: '#1A1A1A',
  TORII_RED: '#D32F2F', 
  FIRE: '#FF4500'
};

export const PHYSICS = {
  GRAVITY: 1400,             
  FALL_MULTIPLIER: 1.8,      
  LOW_JUMP_MULTIPLIER: 2.2,  
  ACCELERATION: 4000,        
  FRICTION: 0.18,            
  AIR_CONTROL: 0.7,          
  PLAYER_SPEED: 340,         
  SPRINT_SPEED: 540,         
  JUMP_FORCE: -880,          
  MIN_JUMP_FORCE: -380,      
  STAMINA_REGEN: 45,
  STAMINA_DECAY: 65,
  TERMINAL_VELOCITY: 800,   
  ENEMY_SPEED: 110,
  FIREBALL_SPEED: 550
};

export const ASSET_PATHS = {
  PLAYER: {
    FORWARD: 'assets/images/Main Character png/Pookie Foward.png',
    BACK: 'assets/images/Main Character png/Pookie Back.png',
    LEFT: 'assets/images/Main Character png/Pookie Left.png',
    RIGHT: 'assets/images/Main Character png/Pookie Right.png',
  },
  TILES: {
    FLOOR: 'assets/images/Movement Objects/Floor Tile.png',
    OBSTACLE: 'assets/images/Movement Objects/Obstical Tile.png',
  },
  COLLECTIBLES: {
    DOOKIE: 'assets/images/Collectibles/Dookie.png',
    POWERUP: 'assets/images/Collectibles/Powerup.png',
    HEAL: 'assets/images/Collectibles/Heal.png',
  },
  ENEMIES: {
    E1_L: 'assets/images/Enemies/Enemy1 Left.png',
    E1_R: 'assets/images/Enemies/Enemy1 Right.png',
    E2_L: 'assets/images/Enemies/Enemy2 Left.png',
    E2_R: 'assets/images/Enemies/Enemy2 Right.png',
    E3_L: 'assets/images/Enemies/Enemy3 Left.png',
    E3_R: 'assets/images/Enemies/Enemy3 Right.png',
    E4_L: 'assets/images/Enemies/Enemy4 Left.png',
    E4_R: 'assets/images/Enemies/Enemy4 Right.png',
    E5_L: 'assets/images/Enemies/Enemy5 Left.png',
    E5_R: 'assets/images/Enemies/Enemy5 Right.png',
  },
  BACKGROUNDS: {
    LEVEL1: 'assets/images/Backgrounds/Level1.png',
    LEVEL2: 'assets/images/Backgrounds/Level2.png',
    LEVEL3: 'assets/images/Backgrounds/Level3.png',
    LEVEL4: 'assets/images/Backgrounds/Level4.png',
    LEVEL5: 'assets/images/Backgrounds/Level5.png',
    MAIN_MENU: 'assets/images/Backgrounds/Main Background.png',
    GAME_OVER: 'assets/images/Backgrounds/Game Over Background.png',
    INSTRUCTIONS: 'assets/images/Backgrounds/Instructions Background.png',
  }
};
