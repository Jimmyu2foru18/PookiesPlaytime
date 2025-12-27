
export type Vector2 = {
  x: number;
  y: number;
};

export enum GameState {
  MENU,
  INSTRUCTIONS,
  OPTIONS,
  PLAYING,
  PAUSED,
  GAME_OVER,
  LEVEL_COMPLETE,
  VICTORY,
  LEADERBOARD
}

export type PowerUpType = 'DOUBLE_JUMP' | 'FIREBALL' | 'NONE';

export interface HighScore {
  name: string;
  score: number;
}
