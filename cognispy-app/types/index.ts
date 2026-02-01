// Game types
export type GameType = 'numbers' | 'weather' | 'house' | 'transport';

// Transport vehicle types
export type TransportType = 'car' | 'bus' | 'plane' | 'bike' | 'train' | 'boat';

// House configuration for procedural generation
export interface HouseConfig {
  door: 'left' | 'center' | 'right' | 'none';
  windows: 'single' | 'double' | 'wide' | 'split';
  chimney: boolean;
}

// Individual item on the game board
export interface CircleItem {
  id: string;
  value: number | string | HouseConfig | TransportType;
  isTarget: boolean;
  isFound: boolean;
  x: number;  // percentage position
  y: number;  // percentage position
  rotation: number;
  zIndex: number;
}

// Game level configuration
export interface GameLevel {
  id: string;
  name: string;
  targets: (number | string)[];
  difficulty: 'Gentle' | 'Moderate' | 'Challenging';
  gridSize: number;
}

// Weather stage configuration
export interface WeatherStage {
  symbol: string;
  name: string;
}

// Main game state
export interface GameState {
  gameType: GameType | null;
  currentStage: number;
  score: number;
  startTime: number | null;
  endTime: number | null;
  isGameActive: boolean;
  circles: CircleItem[];
  foundCount: number;
  totalTargetCount: number;
  targetValue: number | string | HouseConfig | TransportType | null;
  // For numbers game: sequential targets [1, 2, 3]
  targetSequence: number[];
  currentTargetIndex: number;
}

// User preferences stored in localStorage
export interface UserPreferences {
  username: string;
  locale: 'en' | 'ru';
  soundEnabled: boolean;
}

// Category card data
export interface CategoryData {
  type: GameType;
  icon: string;
  colorClass: string;
}
