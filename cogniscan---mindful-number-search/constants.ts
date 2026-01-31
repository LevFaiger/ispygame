
import { GameLevel, Language } from './types';

export const LEVELS: GameLevel[] = [
  {
    id: 'level-1',
    name: 'Beginner Scan',
    targets: [1, 2, 3],
    difficulty: 'Gentle',
    gridSize: 40
  },
  {
    id: 'level-2',
    name: 'Mid-Range Focus',
    targets: [4, 5, 6],
    difficulty: 'Moderate',
    gridSize: 55
  },
  {
    id: 'level-3',
    name: 'Complex Search',
    targets: [7, 8, 9],
    difficulty: 'Challenging',
    gridSize: 60
  }
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: "Hello!",
    askName: "What is your name?",
    namePlaceholder: "Your name...",
    letsPlay: "Let's Play",
    chooseActivity: "Choose an Activity",
    switchUser: "Switch",
    back: "Back",
    target: "Target",
    found: "Found",
    activity: "Activity",
    readyStart: "Ready to start?",
    scanCarefully: "Scan carefully and find all matching items.",
    startExercise: "Start Exercise",
    excellent: "Excellent!",
    nextStage: "Next Stage",
    changeGame: "Choose Different Game",
    writingNote: "Writing you a note...",
    score: "Score",
    levelNames: {
      numbers: "Numbers",
      numbersDesc: "Scan for matching digits.",
      weather: "Spy Weather",
      weatherDesc: "Spot symbols in the clouds.",
      houses: "Where my House?",
      housesDesc: "Find the matching little house.",
      transport: "I Spy Transport",
      transportDesc: "Identify vehicles on the move."
    },
    stage: "Stage",
    footerMsg: "Scan the screen slowly. Take deep, gentle breaths while you play. Focus is a form of meditation."
  },
  ru: {
    welcome: "Привет!",
    askName: "Как вас зовут?",
    namePlaceholder: "Ваше имя...",
    letsPlay: "Начать игру",
    chooseActivity: "Выберите занятие",
    switchUser: "Сменить",
    back: "Назад",
    target: "Цель",
    found: "Найдено",
    activity: "Занятие",
    readyStart: "Готовы начать?",
    scanCarefully: "Внимательно осмотрите экран и найдите все совпадения.",
    startExercise: "Начать упражнение",
    excellent: "Отлично!",
    nextStage: "Следующий этап",
    changeGame: "Выбрать другую игру",
    writingNote: "Пишу вам сообщение...",
    score: "Счёт",
    levelNames: {
      numbers: "Числа",
      numbersDesc: "Найдите нужные цифры.",
      weather: "Погода",
      weatherDesc: "Ищите символы в облаках.",
      houses: "Где мой дом?",
      housesDesc: "Найдите точно такой же домик.",
      transport: "Транспорт",
      transportDesc: "Определите движущийся транспорт."
    },
    stage: "Этап",
    footerMsg: "Медленно сканируйте экран. Делайте глубокие, спокойные вдохи во время игры. Сосредоточенность — это форма медитации."
  }
};

export const WEATHER_STAGES = [
  { symbol: '☂️', name: 'Umbrella' },
  { symbol: '⚡', name: 'Lightning' },
  { symbol: '☁️', name: 'Cloud' },
  { symbol: '💧', name: 'Raindrops' },
  { symbol: '🌈', name: 'Rainbow' },
  { symbol: '🌡️', name: 'Thermometer' },
  { symbol: '🌪️', name: 'Wind' },
  { symbol: '🧭', name: 'Compass' },
  { symbol: '☀️', name: 'Sun' },
  { symbol: '✨', name: 'Stars' }
];

export const ENCOURAGEMENTS = [
  "You're doing great! Keep it up.",
  "Excellent focus. Take your time.",
  "Fantastic! Your visual scanning is sharp.",
  "Beautifully done. Enjoy the process.",
  "Every item counts. Good job!",
  "Keep breathing and stay focused. You've got this!"
];
