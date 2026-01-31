
export type Language = 'en' | 'ru';

export interface GameLevel {
  id: string;
  name: string;
  targets: (number | string)[];
  difficulty: 'Gentle' | 'Moderate' | 'Challenging';
  gridSize: number;
}

export type TransportType = 'car' | 'bus' | 'plane' | 'bike' | 'train' | 'boat';

export interface HouseConfig {
  door: 'left' | 'center' | 'right' | 'none';
  windows: 'single' | 'double' | 'wide' | 'split';
  chimney: boolean;
}

export interface CircleItem {
  id: string;
  value: number | string | HouseConfig | TransportType;
  isTarget: boolean;
  isFound: boolean;
  x: number; // percentage position
  y: number; // percentage position
  rotation: number;
  zIndex: number;
}

export interface GameState {
  currentLevelId: string;
  weatherStageIndex: number;
  houseStageIndex: number;
  transportStageIndex: number; // New stage tracker for transport
  score: number;
  startTime: number | null;
  endTime: number | null;
  isGameActive: boolean;
  circles: CircleItem[];
  foundCount: number;
  totalTargetCount: number;
}
