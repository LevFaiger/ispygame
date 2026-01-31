import { CircleItem, GameState, GameType, HouseConfig } from '@/types';
import {
  LEVELS,
  WEATHER_STAGES,
  TRANSPORT_TYPES,
  generateRandomHouseConfig,
  houseConfigsMatch,
  getRandomDistractorEmoji,
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
  };
}

export function initNumbersGame(stage: number): Partial<GameState> {
  const levelIndex = Math.min(stage - 1, LEVELS.length - 1);
  const level = LEVELS[levelIndex];
  const circles: CircleItem[] = [];

  const cols = 8;
  const rows = 10;
  const targetCount = level.gridSize;

  const targetNumbers = level.targets;
  let targetsPlaced = 0;
  const targetGoal = Math.floor(targetCount * 0.3);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;

      const isTarget = targetsPlaced < targetGoal && Math.random() < 0.4;
      const value = isTarget
        ? targetNumbers[Math.floor(Math.random() * targetNumbers.length)]
        : Math.floor(Math.random() * 10);

      if (isTarget) targetsPlaced++;

      circles.push({
        id: generateUniqueId(),
        value,
        isTarget,
        isFound: false,
        x: col * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * 5,
        y: row * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * 5,
        rotation: (Math.random() - 0.5) * 10,
        zIndex: Math.floor(Math.random() * 10),
      });
    }
  }

  return {
    gameType: 'numbers',
    currentStage: stage,
    circles,
    foundCount: 0,
    totalTargetCount: circles.filter(c => c.isTarget).length,
    targetValue: targetNumbers[0],
    isGameActive: true,
    startTime: Date.now(),
    score: 0,
  };
}

export function initWeatherGame(stage: number): Partial<GameState> {
  const stageIndex = Math.min(stage - 1, WEATHER_STAGES.length - 1);
  const targetSymbol = WEATHER_STAGES[stageIndex].symbol;
  const circles: CircleItem[] = [];

  const cols = 8;
  const rows = 9;
  const targetCount = 6 + stage * 2;

  for (let i = 0; i < targetCount; i++) {
    circles.push({
      id: generateUniqueId(),
      value: targetSymbol,
      isTarget: true,
      isFound: false,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      rotation: (Math.random() - 0.5) * 20,
      zIndex: Math.floor(Math.random() * 20),
    });
  }

  const distractorCount = cols * rows - targetCount;
  for (let i = 0; i < distractorCount; i++) {
    circles.push({
      id: generateUniqueId(),
      value: getRandomDistractorEmoji(targetSymbol),
      isTarget: false,
      isFound: false,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      rotation: (Math.random() - 0.5) * 20,
      zIndex: Math.floor(Math.random() * 20),
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
  const cols = 6 + Math.floor(stage / 2);
  const rows = 4 + Math.ceil(stage / 2);
  const targetCount = Math.max(rows, 4 + stage);

  const targetConfig = generateRandomHouseConfig();
  const circles: CircleItem[] = [];

  for (let i = 0; i < targetCount; i++) {
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const col = i % cols;
    const row = Math.floor(i / cols);

    circles.push({
      id: generateUniqueId(),
      value: targetConfig,
      isTarget: true,
      isFound: false,
      x: col * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * 8,
      y: row * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * 8,
      rotation: 0,
      zIndex: Math.floor(Math.random() * 10),
    });
  }

  const totalCells = cols * rows;
  for (let i = targetCount; i < totalCells; i++) {
    let distractorConfig: HouseConfig;
    do {
      distractorConfig = generateRandomHouseConfig();
    } while (houseConfigsMatch(distractorConfig, targetConfig));

    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const col = i % cols;
    const row = Math.floor(i / cols);

    circles.push({
      id: generateUniqueId(),
      value: distractorConfig,
      isTarget: false,
      isFound: false,
      x: col * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * 8,
      y: row * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * 8,
      rotation: 0,
      zIndex: Math.floor(Math.random() * 10),
    });
  }

  // Shuffle circles
  for (let i = circles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [circles[i], circles[j]] = [circles[j], circles[i]];
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

export function initTransportGame(stage: number): Partial<GameState> {
  const cols = 6 + Math.floor(stage / 2);
  const rows = 4 + Math.ceil(stage / 2);
  const targetCount = Math.max(rows, 5 + stage);

  const targetType = TRANSPORT_TYPES[Math.floor(Math.random() * TRANSPORT_TYPES.length)];
  const circles: CircleItem[] = [];

  for (let i = 0; i < targetCount; i++) {
    circles.push({
      id: generateUniqueId(),
      value: targetType,
      isTarget: true,
      isFound: false,
      x: Math.random() * 85 + 7.5,
      y: Math.random() * 85 + 7.5,
      rotation: (Math.random() - 0.5) * 30 * (stage / 5),
      zIndex: Math.floor(Math.random() * 20),
    });
  }

  const totalCells = cols * rows;
  const distractorTypes = TRANSPORT_TYPES.filter(t => t !== targetType);

  for (let i = targetCount; i < totalCells; i++) {
    const distractorType = distractorTypes[Math.floor(Math.random() * distractorTypes.length)];

    circles.push({
      id: generateUniqueId(),
      value: distractorType,
      isTarget: false,
      isFound: false,
      x: Math.random() * 85 + 7.5,
      y: Math.random() * 85 + 7.5,
      rotation: (Math.random() - 0.5) * 30 * (stage / 5),
      zIndex: Math.floor(Math.random() * 20),
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
    default:
      return createInitialGameState();
  }
}
