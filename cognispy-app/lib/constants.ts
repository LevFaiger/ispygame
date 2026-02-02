import { GameLevel, WeatherStage, HouseConfig, TransportType } from '@/types';

export const LEVELS: GameLevel[] = [
  { id: 'level-1', name: 'Beginner Scan', targets: [1, 2, 3], difficulty: 'Gentle', gridSize: 40 },
  { id: 'level-2', name: 'Mid-Range Focus', targets: [4, 5, 6], difficulty: 'Moderate', gridSize: 55 },
  { id: 'level-3', name: 'Complex Search', targets: [7, 8, 9], difficulty: 'Challenging', gridSize: 60 },
];

export const WEATHER_STAGES: WeatherStage[] = [
  { symbol: '\u2602\ufe0f', name: 'Umbrella' },
  { symbol: '\u26a1', name: 'Lightning' },
  { symbol: '\u2601\ufe0f', name: 'Cloud' },
  { symbol: '\ud83d\udca7', name: 'Raindrop' },
  { symbol: '\ud83c\udf08', name: 'Rainbow' },
  { symbol: '\ud83c\udf21\ufe0f', name: 'Thermometer' },
  { symbol: '\ud83c\udf2a\ufe0f', name: 'Tornado' },
  { symbol: '\ud83e\udded', name: 'Compass' },
  { symbol: '\u2600\ufe0f', name: 'Sun' },
  { symbol: '\u2728', name: 'Sparkles' },
];

export const DISTRACTOR_EMOJIS = [
  '\ud83c\udf1f', '\ud83c\udf1e', '\ud83c\udf19', '\u2b50', '\ud83d\udca8', '\u2744\ufe0f', '\ud83c\udf2b\ufe0f', '\ud83c\udf27\ufe0f', '\ud83c\udf29\ufe0f', '\ud83c\udf2c\ufe0f',
];

export const TRANSPORT_TYPES: TransportType[] = ['car', 'bus', 'plane', 'bike', 'train', 'boat'];

// Emotion faces for the emotion game
export const EMOTION_STAGES = [
  { symbol: '😊', name: 'Happy' },
  { symbol: '😢', name: 'Sad' },
  { symbol: '😠', name: 'Angry' },
  { symbol: '😮', name: 'Surprised' },
  { symbol: '😜', name: 'Winking' },
  { symbol: '🤓', name: 'Nerd' },
  { symbol: '😎', name: 'Cool' },
  { symbol: '🥰', name: 'Love' },
  { symbol: '😴', name: 'Sleepy' },
  { symbol: '🤔', name: 'Thinking' },
];

export const EMOTION_DISTRACTORS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😋', '😛', '😝', '🤪', '🤨', '🧐', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫',
  '😩', '🥺', '😤', '😡', '🤬', '😈', '👿', '💀', '😺', '😸',
];

export function getRandomEmotionDistractor(exclude: string): string {
  const available = EMOTION_DISTRACTORS.filter(e => e !== exclude);
  return available[Math.floor(Math.random() * available.length)];
}

export const HOUSE_DOORS: HouseConfig['door'][] = ['left', 'center', 'right', 'none'];
export const HOUSE_WINDOWS: HouseConfig['windows'][] = ['single', 'double', 'wide', 'split'];

export function generateRandomHouseConfig(): HouseConfig {
  return {
    door: HOUSE_DOORS[Math.floor(Math.random() * HOUSE_DOORS.length)],
    windows: HOUSE_WINDOWS[Math.floor(Math.random() * HOUSE_WINDOWS.length)],
    chimney: Math.random() > 0.5,
  };
}

export function houseConfigsMatch(a: HouseConfig, b: HouseConfig): boolean {
  return a.door === b.door && a.windows === b.windows && a.chimney === b.chimney;
}

export function getRandomDistractorEmoji(exclude: string): string {
  const available = DISTRACTOR_EMOJIS.filter(e => e !== exclude);
  return available[Math.floor(Math.random() * available.length)];
}
