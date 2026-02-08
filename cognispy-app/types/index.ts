// Main category types
export type MainCategory = 'ispy' | 'finddiff' | 'trace' | 'maze';

// Game types (sub-categories under I Spy)
export type GameType = 'numbers' | 'weather' | 'house' | 'transport' | 'emotion' | 'fruits' | 'winter';

// Find Diff game types
export type FindDiffGameType = 'shoes' | 'bears';

// Maze game types
export type MazeGameType = 'keys' | 'threads';

// Trace game types
export type TraceGameType = 'arrows' | 'shapes';

// Main category data
export interface MainCategoryData {
  id: MainCategory;
  character: string;
  emoji: string;
  color: string;
}

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
