
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, CircleItem, GameLevel, HouseConfig, TransportType, Language } from './types';
import { LEVELS, WEATHER_STAGES, ENCOURAGEMENTS, TRANSLATIONS } from './constants';
import { CircleButton } from './components/CircleButton';
import { HouseIcon } from './components/HouseIcon';
import { TransportIcon } from './components/TransportIcon';
import { getMotivationalMessage, getCognitiveTip } from './services/geminiService';

type GameType = 'numbers' | 'weather' | 'houses' | 'transport';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('cogniscan_username'));
  const [language, setLanguage] = useState<Language>((localStorage.getItem('cogniscan_lang') as Language) || 'en');
  const [tempName, setTempName] = useState('');
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  
  const t = TRANSLATIONS[language];

  const [gameState, setGameState] = useState<GameState>({
    currentLevelId: LEVELS[0].id,
    weatherStageIndex: 0,
    houseStageIndex: 0,
    transportStageIndex: 0,
    score: 0,
    startTime: null,
    endTime: null,
    isGameActive: false,
    circles: [],
    foundCount: 0,
    totalTargetCount: 0,
  });

  const [aiMessage, setAiMessage] = useState<string>('');
  const [dailyTip, setDailyTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasStartedAtLeastOnce, setHasStartedAtLeastOnce] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentLevel = useMemo(() => 
    LEVELS.find(l => l.id === gameState.currentLevelId) || LEVELS[0]
  , [gameState.currentLevelId]);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ru' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('cogniscan_lang', nextLang);
  };

  const playSound = useCallback((type: 'correct' | 'incorrect' | 'success') => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'incorrect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'success') {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((f, i) => {
        const stepOsc = ctx.createOscillator();
        const stepGain = ctx.createGain();
        stepOsc.type = 'sine';
        stepOsc.frequency.setValueAtTime(f, now + i * 0.1);
        stepGain.gain.setValueAtTime(0, now + i * 0.1);
        stepGain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
        stepGain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.2);
        stepOsc.connect(stepGain);
        stepGain.connect(ctx.destination);
        stepOsc.start(now + i * 0.1);
        stepOsc.stop(now + i * 0.1 + 0.2);
      });
    }
  }, [soundEnabled]);

  const generateHouseConfig = (): HouseConfig => {
    const doors: HouseConfig['door'][] = ['left', 'center', 'right', 'none'];
    const windows: HouseConfig['windows'][] = ['single', 'double', 'wide', 'split'];
    return {
      door: doors[Math.floor(Math.random() * doors.length)],
      windows: windows[Math.floor(Math.random() * windows.length)],
      chimney: Math.random() > 0.5,
    };
  };

  const areConfigsEqual = (a: HouseConfig, b: HouseConfig) => 
    a.door === b.door && a.windows === b.windows && a.chimney === b.chimney;

  const initHouseStage = useCallback((stageIndex: number) => {
    const cols = 6 + Math.floor(stageIndex / 2);
    const rows = 4 + Math.ceil(stageIndex / 2);
    const targetConfig = generateHouseConfig();
    const newCircles: CircleItem[] = [];
    const numTargets = Math.max(rows, 4 + stageIndex);
    const targetPositions = new Set<string>();
    for (let r = 0; r < rows; r++) targetPositions.add(`${r}-${Math.floor(Math.random() * cols)}`);
    while (targetPositions.size < numTargets) targetPositions.add(`${Math.floor(Math.random() * rows)}-${Math.floor(Math.random() * cols)}`);

    const cellW = 100 / cols;
    const cellH = 100 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let config: HouseConfig;
        const isTarget = targetPositions.has(`${r}-${c}`);
        if (isTarget) config = { ...targetConfig };
        else do { config = generateHouseConfig(); } while (areConfigsEqual(config, targetConfig));
        newCircles.push({
          id: `h-${r}-${c}`,
          value: config,
          isTarget,
          isFound: false,
          x: (c * cellW) + (cellW / 2) - 6 + (Math.random() - 0.5) * cellW * 0.15,
          y: (r * cellH) + (cellH / 2) - 6 + (Math.random() - 0.5) * cellH * 0.15,
          rotation: 0,
          zIndex: 10,
        });
      }
    }
    setGameState(prev => ({ ...prev, circles: newCircles, foundCount: 0, totalTargetCount: targetPositions.size, startTime: Date.now(), endTime: null, isGameActive: true, score: 0, houseStageIndex: stageIndex }));
    setAiMessage('');
    setHasStartedAtLeastOnce(true);
  }, []);

  const initTransportStage = useCallback((stageIndex: number) => {
    const cols = 6 + Math.floor(stageIndex / 2);
    const rows = 4 + Math.ceil(stageIndex / 2);
    const transportTypes: TransportType[] = ['car', 'bus', 'plane', 'bike', 'train', 'boat'];
    const targetType = transportTypes[Math.floor(Math.random() * transportTypes.length)];
    const newCircles: CircleItem[] = [];
    const numTargets = Math.max(rows, 5 + stageIndex);
    const targetPositions = new Set<string>();
    for (let r = 0; r < rows; r++) targetPositions.add(`${r}-${Math.floor(Math.random() * cols)}`);
    while (targetPositions.size < numTargets) targetPositions.add(`${Math.floor(Math.random() * rows)}-${Math.floor(Math.random() * cols)}`);
    const overlapProbability = Math.min(0.3, stageIndex * 0.05);
    const maxRotation = Math.min(45, stageIndex * 5);
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isTarget = targetPositions.has(`${r}-${c}`);
        let value: TransportType;
        if (isTarget) value = targetType;
        else { do { value = transportTypes[Math.floor(Math.random() * transportTypes.length)]; } while (value === targetType); }
        const rotation = (Math.random() - 0.5) * 2 * maxRotation;
        const mainItem: CircleItem = {
          id: `t-${r}-${c}`,
          value,
          isTarget,
          isFound: false,
          x: ((c * cellW) + (cellW / 2) - 6) + (Math.random() - 0.5) * cellW * 0.2,
          y: ((r * cellH) + (cellH / 2) - 6) + (Math.random() - 0.5) * cellH * 0.2,
          rotation,
          zIndex: 10 + Math.floor(Math.random() * 5),
        };
        newCircles.push(mainItem);
        if (stageIndex > 0 && Math.random() < overlapProbability) {
          let ovValue: TransportType;
          do { ovValue = transportTypes[Math.floor(Math.random() * transportTypes.length)]; } while (ovValue === targetType);
          newCircles.push({
            id: `t-ov-${r}-${c}`,
            value: ovValue,
            isTarget: false,
            isFound: false,
            x: mainItem.x + (Math.random() - 0.5) * 6,
            y: mainItem.y + (Math.random() - 0.5) * 6,
            rotation: mainItem.rotation + (Math.random() - 0.5) * 30,
            zIndex: mainItem.zIndex + 1,
          });
        }
      }
    }
    setGameState(prev => ({ ...prev, circles: newCircles, foundCount: 0, totalTargetCount: targetPositions.size, startTime: Date.now(), endTime: null, isGameActive: true, score: 0, transportStageIndex: stageIndex }));
    setAiMessage('');
    setHasStartedAtLeastOnce(true);
  }, []);

  const initWeatherStage = useCallback((stageIndex: number) => {
    const stage = WEATHER_STAGES[stageIndex];
    const newCircles: CircleItem[] = [];
    const cols = 8, rows = 9;
    const numTargets = 6 + (stageIndex * 2);
    const numOverlapped = stageIndex === 0 ? 0 : (stageIndex + 1);
    const overlapPercent = Math.min(50, stageIndex * 10);
    const numBaseTargets = numTargets - numOverlapped;
    const totalItemsCount = Math.max(50, 40 + stageIndex * 5);
    const cellW = 100 / cols, cellH = 100 / rows;
    const grid = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid.push({ r, c });
    for (let i = grid.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [grid[i], grid[j]] = [grid[j], grid[i]]; }
    const positions = grid.slice(0, totalItemsCount).map(g => ({ x: (g.c * cellW) + (cellW / 2) + (Math.random() - 0.5) * cellW * 0.6, y: (g.r * cellH) + (cellH / 2) + (Math.random() - 0.5) * cellH * 0.6 }));
    const targetIndices = new Set<number>();
    while (targetIndices.size < numBaseTargets) targetIndices.add(Math.floor(Math.random() * positions.length));
    const baseTargetObjects: CircleItem[] = [];
    Array.from(targetIndices).forEach((posIdx, i) => {
      const item: CircleItem = { id: `wt-base-${i}`, value: stage.symbol, isTarget: true, isFound: false, x: positions[posIdx].x - 6, y: positions[posIdx].y - 6, rotation: Math.random() * 20 - 10, zIndex: 100 };
      baseTargetObjects.push(item);
      newCircles.push(item);
    });
    for (let i = 0; i < numOverlapped; i++) {
      const baseTarget = baseTargetObjects[i % baseTargetObjects.length];
      const currentOffset = 10 * (1 - (overlapPercent / 100));
      const angle = Math.random() * Math.PI * 2;
      newCircles.push({ id: `wt-overlap-${i}`, value: stage.symbol, isTarget: true, isFound: false, x: baseTarget.x + Math.cos(angle) * currentOffset, y: baseTarget.y + Math.sin(angle) * currentOffset, rotation: Math.random() * 30 - 15, zIndex: 110 + i });
    }
    positions.forEach((pos, idx) => {
      if (!targetIndices.has(idx)) {
        let otherStage;
        do { otherStage = WEATHER_STAGES[Math.floor(Math.random() * WEATHER_STAGES.length)]; } while (otherStage.symbol === stage.symbol);
        newCircles.push({ id: `wd-${idx}`, value: otherStage.symbol, isTarget: false, isFound: false, x: pos.x - 6, y: pos.y - 6, rotation: Math.random() * 40 - 20, zIndex: Math.floor(Math.random() * 40) });
      }
    });
    newCircles.sort((a, b) => a.zIndex - b.zIndex);
    setGameState(prev => ({ ...prev, circles: newCircles, foundCount: 0, totalTargetCount: numTargets, isGameActive: true, weatherStageIndex: stageIndex }));
    setAiMessage('');
    setHasStartedAtLeastOnce(true);
  }, []);

  const initLevel = useCallback((level: GameLevel) => {
    const newCircles: CircleItem[] = [];
    const cols = 8, rows = 10;
    const cellW = 100 / cols, cellH = 100 / rows;
    const grid = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid.push({ r, c });
    for (let i = grid.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [grid[i], grid[j]] = [grid[j], grid[i]]; }
    const positions = grid.slice(0, level.gridSize);
    let targetsPlaced = 0;
    const targetProbability = level.difficulty === 'Gentle' ? 0.4 : level.difficulty === 'Moderate' ? 0.35 : 0.3;
    positions.forEach((p, i) => {
      const isTargetCandidate = Math.random() < targetProbability;
      let val: number, isTarget = false;
      if (isTargetCandidate || targetsPlaced < 3) { val = level.targets[Math.floor(Math.random() * level.targets.length)] as number; targetsPlaced++; isTarget = true; }
      else { let otherVal; do { otherVal = Math.floor(Math.random() * 9) + 1; } while (level.targets.includes(otherVal)); val = otherVal; isTarget = false; }
      newCircles.push({ id: `c-${i}`, value: val, isTarget, isFound: false, x: (p.c * cellW) + (cellW/2) - 6, y: (p.r * cellH) + (cellH/2) - 6, rotation: Math.random() * 30 - 15, zIndex: isTarget ? 100 : Math.floor(Math.random() * 50) });
    });
    newCircles.sort((a, b) => a.zIndex - b.zIndex);
    setGameState(prev => ({ ...prev, circles: newCircles, foundCount: 0, totalTargetCount: targetsPlaced, isGameActive: true }));
    setAiMessage('');
    setHasStartedAtLeastOnce(true);
  }, []);

  useEffect(() => { getCognitiveTip(language).then(setDailyTip); }, [language]);

  const handleCircleClick = (id: string) => {
    if (!gameState.isGameActive) return;
    const circle = gameState.circles.find(c => c.id === id);
    if (!circle || circle.isFound) return;
    if (circle.isTarget) {
      playSound('correct');
      const newFoundCount = gameState.foundCount + 1;
      const newScore = gameState.score + 10;
      const updatedCircles = gameState.circles.map(c => c.id === id ? { ...c, isFound: true } : c);
      setGameState(prev => ({ ...prev, circles: updatedCircles, foundCount: newFoundCount, score: newScore }));
      if (newFoundCount === gameState.totalTargetCount) finishGame(newScore);
    } else {
      playSound('incorrect');
      setGameState(prev => ({ ...prev, score: Math.max(0, prev.score - 5) }));
    }
  };

  const finishGame = async (finalScore: number) => {
    playSound('success');
    setGameState(prev => ({ ...prev, isGameActive: false, endTime: Date.now() }));
    setIsLoading(true);
    let modeName = "";
    if (selectedGameType === 'weather') modeName = `${t.levelNames.weather} ${t.stage} ${gameState.weatherStageIndex + 1}`;
    else if (selectedGameType === 'houses') modeName = `${t.levelNames.houses} ${t.stage} ${gameState.houseStageIndex + 1}`;
    else if (selectedGameType === 'transport') modeName = `${t.levelNames.transport} ${t.stage} ${gameState.transportStageIndex + 1}`;
    else modeName = currentLevel.name;
    const msg = await getMotivationalMessage(finalScore, modeName, userName || 'friend', language);
    setAiMessage(msg);
    setIsLoading(false);
  };

  const nextStage = () => {
    if (selectedGameType === 'weather') initWeatherStage((gameState.weatherStageIndex + 1) % WEATHER_STAGES.length);
    else if (selectedGameType === 'houses') initHouseStage(gameState.houseStageIndex + 1);
    else if (selectedGameType === 'transport') initTransportStage(gameState.transportStageIndex + 1);
  };

  const resetCurrentLevel = () => {
    if (selectedGameType === 'weather') initWeatherStage(gameState.weatherStageIndex);
    else if (selectedGameType === 'houses') initHouseStage(gameState.houseStageIndex);
    else if (selectedGameType === 'transport') initTransportStage(gameState.transportStageIndex);
    else initLevel(currentLevel);
  };

  if (!userName) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 w-full max-w-md text-center">
          <div className="flex justify-end mb-4">
            <button onClick={toggleLanguage} className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">{language}</button>
          </div>
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h1 className="text-3xl font-black mb-2">{t.welcome}</h1>
          <p className="text-slate-500 mb-6">{t.askName}</p>
          <form onSubmit={(e) => { e.preventDefault(); if (tempName.trim()) { localStorage.setItem('cogniscan_username', tempName.trim()); setUserName(tempName.trim()); } }} className="space-y-6">
            <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder={t.namePlaceholder} className="w-full px-6 py-4 text-xl font-bold border-4 rounded-2xl text-center" autoFocus />
            <button type="submit" disabled={!tempName.trim()} className="w-full py-5 bg-indigo-600 text-white text-xl font-black rounded-2xl shadow-xl">{t.letsPlay}</button>
          </form>
        </div>
      </div>
    );
  }

  if (!selectedGameType) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12 font-sans">
        <header className="w-full max-w-4xl flex justify-between items-center mb-12">
           <button onClick={() => { localStorage.removeItem('cogniscan_username'); setUserName(null); }} className="text-sm font-bold text-indigo-600 hover:underline">{userName} ({t.switchUser})</button>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900">CogniScan</h1>
           <button onClick={toggleLanguage} className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">{language}</button>
        </header>
        <main className="w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 text-center">{t.chooseActivity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <button onClick={() => setSelectedGameType('numbers')} className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-indigo-600 shadow-lg transition-all text-left flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-600">123</div>
              <div><h3 className="text-2xl font-black text-slate-900">{t.levelNames.numbers}</h3><p className="text-slate-500">{t.levelNames.numbersDesc}</p></div>
            </button>
            <button onClick={() => { setSelectedGameType('weather'); setGameState(prev => ({ ...prev, weatherStageIndex: 0 })); }} className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-blue-500 shadow-lg transition-all text-left flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl">☂️</div>
              <div><h3 className="text-2xl font-black text-slate-900">{t.levelNames.weather}</h3><p className="text-slate-500">{t.levelNames.weatherDesc}</p></div>
            </button>
            <button onClick={() => { setSelectedGameType('houses'); setGameState(prev => ({ ...prev, houseStageIndex: 0 })); }} className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-orange-500 shadow-lg transition-all text-left flex items-center gap-6">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center"><HouseIcon config={{ door: 'center', windows: 'double', chimney: true }} className="w-12 h-12 text-orange-600" /></div>
              <div><h3 className="text-2xl font-black text-slate-900">{t.levelNames.houses}</h3><p className="text-slate-500">{t.levelNames.housesDesc}</p></div>
            </button>
            <button onClick={() => { setSelectedGameType('transport'); setGameState(prev => ({ ...prev, transportStageIndex: 0 })); }} className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-emerald-500 shadow-lg transition-all text-left flex items-center gap-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center"><TransportIcon type="car" className="w-12 h-12 text-emerald-600" /></div>
              <div><h3 className="text-2xl font-black text-slate-900">{t.levelNames.transport}</h3><p className="text-slate-500">{t.levelNames.transportDesc}</p></div>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const houseTarget = selectedGameType === 'houses' ? gameState.circles.find(c => c.isTarget)?.value as HouseConfig : null;
  const transportTarget = selectedGameType === 'transport' ? gameState.circles.find(c => c.isTarget)?.value as TransportType : null;
  const weatherTarget = selectedGameType === 'weather' ? WEATHER_STAGES[gameState.weatherStageIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-3 md:p-8 font-sans">
      <header className="w-full max-w-4xl flex justify-between items-center mb-4">
          <button onClick={() => setSelectedGameType(null)} className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" /></svg> {t.back}</button>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">CogniScan</h1>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-full ${soundEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></button>
      </header>
      <main className="w-full max-w-4xl flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <section className="bg-white p-3 rounded-2xl shadow-sm border flex flex-col items-center">
            <h2 className="text-[10px] font-bold uppercase text-slate-400">{t.target}</h2>
            <div className="flex gap-2">
              {selectedGameType === 'numbers' && currentLevel.targets.map(n => <div key={n} className="w-10 h-10 border-2 border-slate-900 rounded-full flex items-center justify-center font-black">{n}</div>)}
              {selectedGameType === 'weather' && <div className="text-3xl">{weatherTarget?.symbol}</div>}
              {selectedGameType === 'houses' && houseTarget && <div className="w-12 h-12"><HouseIcon config={houseTarget} /></div>}
              {selectedGameType === 'transport' && transportTarget && <div className="w-12 h-12"><TransportIcon type={transportTarget} /></div>}
            </div>
          </section>
          <section className="bg-white p-3 rounded-2xl shadow-sm border flex flex-col items-center justify-center">
            <h2 className="text-[10px] font-bold uppercase text-slate-400">{t.found}</h2>
            <p className="text-xl font-black text-indigo-600">{gameState.foundCount} / {gameState.totalTargetCount}</p>
          </section>
          <section className="hidden md:flex bg-white p-3 rounded-2xl shadow-sm border flex flex-col items-center justify-center">
            <h2 className="text-[10px] font-bold uppercase text-slate-400">{t.activity}</h2>
            <p className="font-black text-slate-900 uppercase text-xs">
              {selectedGameType === 'houses' ? `${t.levelNames.houses} ${t.stage} ${gameState.houseStageIndex + 1}` : selectedGameType === 'weather' ? `${t.levelNames.weather} ${t.stage} ${gameState.weatherStageIndex + 1}` : selectedGameType === 'transport' ? `${t.levelNames.transport} ${t.stage} ${gameState.transportStageIndex + 1}` : currentLevel.name}
            </p>
          </section>
        </div>
        <div className="relative w-full bg-white rounded-3xl shadow-xl border-4 border-slate-100 h-[500px] md:h-[650px] overflow-hidden">
          {gameState.isGameActive ? (
            <div className="w-full h-full relative">
              {gameState.circles.map(item => <CircleButton key={item.id} item={item} onClick={handleCircleClick} disabled={false} />)}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-white/90 z-20">
              {gameState.endTime ? (
                <div className="text-center max-w-md animate-in zoom-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg></div>
                  <h2 className="text-3xl font-black mb-2">{t.excellent}</h2>
                  <p className="text-slate-500 mb-6 italic leading-relaxed">{isLoading ? t.writingNote : aiMessage}</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={nextStage} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">{t.nextStage}</button>
                    <button onClick={() => setSelectedGameType(null)} className="w-full py-4 bg-slate-100 font-bold rounded-2xl">{t.changeGame}</button>
                  </div>
                </div>
              ) : (
                <div className="text-center max-w-sm">
                  <h2 className="text-2xl font-black mb-4">{t.readyStart}</h2>
                  <p className="text-slate-500 mb-8">{t.scanCarefully}</p>
                  <button onClick={resetCurrentLevel} className="w-full py-5 bg-indigo-600 text-white text-xl font-black rounded-2xl shadow-xl">{t.startExercise}</button>
                </div>
              )}
            </div>
          )}
        </div>
        {dailyTip && (
          <div className="bg-indigo-50 p-4 rounded-2xl border flex items-center gap-3">
            <span className="text-xl">💡</span>
            <p className="text-xs md:text-sm text-indigo-900 font-medium">{dailyTip}</p>
          </div>
        )}
      </main>
      <footer className="mt-8 text-slate-400 text-center text-xs px-10 leading-relaxed max-w-md">{t.footerMsg}</footer>
    </div>
  );
};

export default App;
