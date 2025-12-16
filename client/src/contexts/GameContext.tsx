import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, RunState, StageState, REQUIRED_SCORES, MAX_TURNS, DIGITS } from '@/lib/game-constants';
import { generateAnswer, calculateHitBlow, calculateScore } from '@/lib/game-logic';

interface GameContextType {
  gameState: GameState;
  runState: RunState | null;
  stageState: StageState | null;
  startGame: () => void;
  submitGuess: (guess: string) => void;
  nextStage: () => void;
  resetGame: () => void;
  giveUp: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_GAME_STATE: GameState = {
  coins: 0,
  highScore: 0,
  highStage: 0,
  ownedSkins: ['classic'],
  equippedSkin: 'classic',
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('hb_rl_save_v1');
    return saved ? JSON.parse(saved) : INITIAL_GAME_STATE;
  });

  const [runState, setRunState] = useState<RunState | null>(null);
  const [stageState, setStageState] = useState<StageState | null>(null);

  useEffect(() => {
    localStorage.setItem('hb_rl_save_v1', JSON.stringify(gameState));
  }, [gameState]);

  const startGame = () => {
    setRunState({
      stage: 1,
      score: 0,
      deck: [],
      hp: 3,
      combo: 0,
      comboMult: 1.0,
    });
    startStage(1);
  };

  const startStage = (stageNum: number) => {
    setStageState({
      answer: generateAnswer(DIGITS),
      guesses: [],
      turn: 1,
      isClear: false,
      isGameOver: false,
    });
  };

  const submitGuess = (guess: string) => {
    if (!stageState || !runState || stageState.isGameOver || stageState.isClear) return;

    const { hit, blow } = calculateHitBlow(guess, stageState.answer);
    const newGuesses = [...stageState.guesses, { guess, hit, blow }];
    
    let isClear = false;
    let isGameOver = false;

    if (hit === DIGITS) {
      isClear = true;
      // Calculate score
      const stageScore = calculateScore(stageState.turn, MAX_TURNS, runState.comboMult);
      setRunState(prev => prev ? {
        ...prev,
        score: prev.score + stageScore,
        combo: prev.combo + 1,
        comboMult: prev.comboMult + 0.1
      } : null);
      
      // Update high score
      if ((runState.score + stageScore) > gameState.highScore) {
        setGameState(prev => ({ ...prev, highScore: runState.score + stageScore }));
      }
    } else if (stageState.turn >= MAX_TURNS) {
      isGameOver = true;
      setRunState(prev => prev ? { ...prev, combo: 0, comboMult: 1.0 } : null);
    }

    setStageState(prev => prev ? {
      ...prev,
      guesses: newGuesses,
      turn: prev.turn + 1,
      isClear,
      isGameOver
    } : null);
  };

  const nextStage = () => {
    if (!runState) return;
    const nextStageNum = runState.stage + 1;
    setRunState(prev => prev ? { ...prev, stage: nextStageNum } : null);
    
    // Update high stage
    if (nextStageNum > gameState.highStage) {
      setGameState(prev => ({ ...prev, highStage: nextStageNum }));
    }
    
    startStage(nextStageNum);
  };

  const resetGame = () => {
    setRunState(null);
    setStageState(null);
  };

  const giveUp = () => {
    if (stageState) {
      setStageState(prev => prev ? { ...prev, isGameOver: true } : null);
    }
  };

  return (
    <GameContext.Provider value={{
      gameState,
      runState,
      stageState,
      startGame,
      submitGuess,
      nextStage,
      resetGame,
      giveUp
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
