import { CircleItem, GameState, GameType, HouseConfig } from '@/types';
import {
  LEVELS,
  WEATHER_STAGES,
  TRANSPORT_TYPES,
  EMOTION_STAGES,
  FRUIT_STAGES,
  generateRandomHouseConfig,
  houseConfigsMatch,
  getRandomDistractorEmoji,
  getRandomEmotionDistractor,
  getRandomFruitDistractor,
} from './constants';

function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createInitialGameState(): GameState {
  return {
    gameType: null,
    currentStage: 1,
    score: 0,
    startTime: null,
    endTime: null,
    isGameActive: false,
    circles: [],
    foundCount: 0,
    totalTargetCount: 0,
    targetValue: null,
    targetSequence: [],
    currentTargetIndex: 0,
  };
}

export function initNumbersGame(stage: number): Partial<GameState> {
  const levelIndex = Math.min(stage - 1, LEVELS.length - 1);
  const level = LEVELS[levelIndex];
  const circles: CircleItem[] = [];

  // Grid with staggered layout
  const cols = 6;
  const rows = 5 + Math.floor(stage / 2);
  const targetNumbers = level.targets as number[]; // e.g., [1, 2, 3]

  // Generate grid positions (no overlap, staggered)
  const positions = generateGridPositions(cols, rows, 8, 3);
  const totalItems = Math.min(positions.length, 25 + stage * 3);

  // Ensure we have enough of each target number
  const targetsPerNumber = 3 + stage; // How many of each target number (1, 2, 3)
  const targetCounts: Record<number, number> = {};
  targetNumbers.forEach(n => { targetCounts[n] = 0; });

  for (let i = 0; i < totalItems; i++) {
    const pos = positions[i];
    let value: number;
    let isTarget = false;

    // Try to place target numbers evenly
    const unfilledTarget = targetNumbers.find(n => targetCounts[n] < targetsPerNumber);
    if (unfilledTarget !== undefined && Math.random() < 0.5) {
      value = unfilledTarget;
      targetCounts[value]++;
      isTarget = true;
    } else {
      // Place a non-target number (0, 4-9)
      const nonTargets = [0, 4, 5, 6, 7, 8, 9];
      value = nonTargets[Math.floor(Math.random() * nonTargets.length)];
    }

    circles.push({
      id: generateUniqueId(),
      value,
      isTarget,
      isFound: false,
      x: pos.x,
      y: pos.y,
      rotation: (Math.random() - 0.5) * 12,
      zIndex: 1,
    });
  }

  // Count total targets (all 1s, 2s, and 3s)
  const totalTargetCount = circles.filter(c => c.isTarget).length;

  return {
    gameType: 'numbers',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount,
    targetValue: targetNumbers[0], // Start with first target (1)
    targetSequence: targetNumbers as number[],
    currentTargetIndex: 0,
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

export function initWeatherGame(stage: number): Partial<GameState> {
  const stageIndex = Math.min(stage - 1, WEATHER_STAGES.length - 1);
  const targetSymbol = WEATHER_STAGES[stageIndex].symbol;
  const circles: CircleItem[] = [];

  // Grid size increases with stage
  const cols = 5;
  const rows = 4 + Math.floor(stage / 3);
  const targetCount = 5 + stage;

  // Generate grid positions (no overlap guaranteed)
  const positions = generateGridPositions(cols, rows, 10, 4);
  const totalItems = Math.min(positions.length, 20 + stage * 2);

  for (let i = 0; i < totalItems; i++) {
    const isTarget = i < targetCount;
    const value = isTarget ? targetSymbol : getRandomDistractorEmoji(targetSymbol);
    const pos = positions[i];

    circles.push({
      id: generateUniqueId(),
      value,
      isTarget,
      isFound: false,
      x: pos.x,
      y: pos.y,
      rotation: (Math.random() - 0.5) * 15,
      zIndex: 1,
    });
  }

  return {
    gameType: 'weather',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount: targetCount,
    targetValue: targetSymbol,
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

export function initHouseGame(stage: number): Partial<GameState> {
  // Grid with staggered layout
  const cols = 5;
  const rows = 4 + Math.floor(stage / 3);
  const targetCount = 4 + stage;

  const targetConfig = generateRandomHouseConfig();
  const circles: CircleItem[] = [];

  // Generate grid positions (no overlap, staggered)
  const positions = generateGridPositions(cols, rows, 10, 3);
  const totalItems = Math.min(positions.length, 18 + stage * 2);

  for (let i = 0; i < totalItems; i++) {
    const isTarget = i < targetCount;
    let value: HouseConfig;

    if (isTarget) {
      value = targetConfig;
    } else {
      do {
        value = generateRandomHouseConfig();
      } while (houseConfigsMatch(value, targetConfig));
    }

    const pos = positions[i];

    circles.push({
      id: generateUniqueId(),
      value,
      isTarget,
      isFound: false,
      x: pos.x,
      y: pos.y,
      rotation: 0,
      zIndex: 1,
    });
  }

  return {
    gameType: 'house',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount: targetCount,
    targetValue: targetConfig,
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

// Generate grid positions with staggered rows and slight randomization
function generateGridPositions(
  cols: number,
  rows: number,
  padding: number = 8,
  jitter: number = 3
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];

  const cellWidth = (100 - padding * 2) / cols;
  const cellHeight = (100 - padding * 2) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Stagger: offset odd columns by half cell height
      const staggerOffset = col % 2 === 1 ? cellHeight * 0.4 : 0;

      // Center of each cell with stagger and slight random offset
      const x = padding + col * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * jitter;
      const y = padding + row * cellHeight + cellHeight / 2 + staggerOffset + (Math.random() - 0.5) * jitter;

      // Only add if within bounds
      if (y < 100 - padding) {
        positions.push({ x, y });
      }
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
}

export function initTransportGame(stage: number): Partial<GameState> {
  // Grid size increases with stage
  const cols = 5;
  const rows = 4 + Math.floor(stage / 3);
  const targetCount = 5 + stage;

  const targetType = TRANSPORT_TYPES[Math.floor(Math.random() * TRANSPORT_TYPES.length)];
  const circles: CircleItem[] = [];
  const distractorTypes = TRANSPORT_TYPES.filter(t => t !== targetType);

  // Generate grid positions (no overlap guaranteed)
  const positions = generateGridPositions(cols, rows, 10, 4);
  const totalItems = Math.min(positions.length, 18 + stage * 2);

  for (let i = 0; i < totalItems; i++) {
    const isTarget = i < targetCount;
    const value = isTarget
      ? targetType
      : distractorTypes[Math.floor(Math.random() * distractorTypes.length)];
    const pos = positions[i];

    circles.push({
      id: generateUniqueId(),
      value,
      isTarget,
      isFound: false,
      x: pos.x,
      y: pos.y,
      rotation: (Math.random() - 0.5) * 15,
      zIndex: 1,
    });
  }

  return {
    gameType: 'transport',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount: targetCount,
    targetValue: targetType,
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

export function initEmotionGame(stage: number): Partial<GameState> {
  const stageIndex = Math.min(stage - 1, EMOTION_STAGES.length - 1);
  const targetSymbol = EMOTION_STAGES[stageIndex].symbol;
  const circles: CircleItem[] = [];

  // Grid with staggered layout
  const cols = 5;
  const rows = 4 + Math.floor(stage / 3);
  const targetCount = 5 + stage;

  // Generate grid positions (no overlap, staggered)
  const positions = generateGridPositions(cols, rows, 10, 4);
  const totalItems = Math.min(positions.length, 20 + stage * 2);

  for (let i = 0; i < totalItems; i++) {
    const isTarget = i < targetCount;
    const value = isTarget ? targetSymbol : getRandomEmotionDistractor(targetSymbol);
    const pos = positions[i];

    circles.push({
      id: generateUniqueId(),
      value,
      isTarget,
      isFound: false,
      x: pos.x,
      y: pos.y,
      rotation: (Math.random() - 0.5) * 15,
      zIndex: 1,
    });
  }

  return {
    gameType: 'emotion',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount: targetCount,
    targetValue: targetSymbol,
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

export function initFruitsGame(stage: number): Partial<GameState> {
  const stageIndex = Math.min(stage - 1, FRUIT_STAGES.length - 1);
  const targetSymbol = FRUIT_STAGES[stageIndex].symbol;
  const circles: CircleItem[] = [];

  // Grid with staggered layout
  const cols = 5;
  const rows = 4 + Math.floor(stage / 3);
  const targetCount = 5 + stage;

  // Generate grid positions (no overlap, staggered)
  const positions = generateGridPositions(cols, rows, 10, 4);
  const totalItems = Math.min(positions.length, 20 + stage * 2);

  for (let i = 0; i < totalItems; i++) {
    const isTarget = i < targetCount;
    const value = isTarget ? targetSymbol : getRandomFruitDistractor(targetSymbol);
    const pos = positions[i];

    circles.push({
      id: generateUniqueId(),
      value,
      isTarget,
      isFound: false,
      x: pos.x,
      y: pos.y,
      rotation: (Math.random() - 0.5) * 15,
      zIndex: 1,
    });
  }

  return {
    gameType: 'fruits',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount: targetCount,
    targetValue: targetSymbol,
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

export function initGame(type: GameType, stage: number): Partial<GameState> {
  switch (type) {
    case 'numbers':
      return initNumbersGame(stage);
    case 'weather':
      return initWeatherGame(stage);
    case 'house':
      return initHouseGame(stage);
    case 'transport':
      return initTransportGame(stage);
    case 'emotion':
      return initEmotionGame(stage);
    case 'fruits':
      return initFruitsGame(stage);
    default:
      return createInitialGameState();
  }
}
