import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MAX_TURNS, DIGITS } from '@/lib/game-constants';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';
import Tutorial from '@/components/Tutorial';

export default function GameScreenDragDrop() {
  const { runState, stageState, submitGuess, nextStage, resetGame } = useGame();
  const { playSound } = useSound();
  const { t } = useLanguage();
  
  const [currentInput, setCurrentInput] = useState<string[]>(Array(DIGITS).fill(''));
  const [draggedNum, setDraggedNum] = useState<string | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState<number | null>(null);

  // Reset input when stage changes
  useEffect(() => {
    setCurrentInput(Array(DIGITS).fill(''));
    setDraggedNum(null);
    setDraggedFromSlot(null);
  }, [stageState?.turn, stageState?.isClear]);

  if (!runState || !stageState) return null;

  // ドラッグ開始（数字パッドから）
  const handleNumDragStart = (num: number) => {
    if (stageState.isClear || stageState.isGameOver) return;
    if (currentInput.includes(num.toString())) {
      playSound('error');
      return;
    }
    setDraggedNum(num.toString());
    playSound('hover');
  };

  // ドラッグ開始（スロットから）
  const handleSlotDragStart = (slotIndex: number) => {
    if (currentInput[slotIndex] !== '') {
      setDraggedNum(currentInput[slotIndex]);
      setDraggedFromSlot(slotIndex);
      playSound('hover');
    }
  };

  // スロットへドロップ
  const handleSlotDrop = (slotIndex: number) => {
    if (!draggedNum || stageState.isClear || stageState.isGameOver) return;

    const newInput = [...currentInput];
    
    // スロットから移動した場合、元のスロットをクリア
    if (draggedFromSlot !== null && draggedFromSlot !== slotIndex) {
      newInput[draggedFromSlot] = '';
    }
    
    // 新しいスロットに配置
    newInput[slotIndex] = draggedNum;
    setCurrentInput(newInput);
    setDraggedNum(null);
    setDraggedFromSlot(null);
    playSound('click');
  };

  // パッドへドロップ（数字を戻す）
  const handlePadDrop = () => {
    if (draggedFromSlot !== null) {
      const newInput = [...currentInput];
      newInput[draggedFromSlot] = '';
      setCurrentInput(newInput);
      playSound('click');
    }
    setDraggedNum(null);
    setDraggedFromSlot(null);
  };

  const handleSubmit = () => {
    if (currentInput.some(v => v === '')) {
      playSound('error');
      return;
    }
    playSound('success');
    submitGuess(currentInput.join(''));
  };

  const isInputComplete = !currentInput.some(v => v === '');

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4 animate-in fade-in duration-500">
      {runState.stage === 1 && stageState.turn === 1 && stageState.guesses.length === 0 && <Tutorial />}
      
      {/* HUD Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('stage')}</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-primary font-bold">{runState.stage}</div>
        </div>
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('score')}</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-accent font-bold">{runState.score}</div>
        </div>
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('turn')}</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-secondary-foreground font-bold">
            {stageState.turn} <span className="text-sm text-muted-foreground">/ {MAX_TURNS}</span>
          </div>
        </div>
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('combo')}</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-chart-3 font-bold">x{runState.comboMult.toFixed(1)}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative min-h-[400px] flex flex-col gap-6">
        
        {/* Input Slots */}
        <div className="flex justify-center gap-4 my-4">
          {currentInput.map((num, idx) => (
            <div
              key={idx}
              draggable={num !== ''}
              onDragStart={() => handleSlotDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleSlotDrop(idx)}
              className={cn(
                "w-16 h-20 md:w-20 md:h-24 border-2 rounded-xl flex items-center justify-center text-4xl font-[family-name:var(--font-display)] transition-all duration-200 cursor-move backdrop-blur-md",
                draggedNum && draggedFromSlot !== idx
                  ? "border-accent/50 bg-accent/5"
                  : "border-primary/30 bg-card/50 hover:border-primary/60",
                num !== '' ? "text-foreground" : "text-muted",
                num !== '' && draggedNum === num ? "opacity-50" : ""
              )}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Numpad with Drag Support */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-md mx-auto w-full">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              key={num}
              draggable
              onDragStart={() => handleNumDragStart(num)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handlePadDrop}
              className={cn(
                "h-14 flex items-center justify-center text-xl font-[family-name:var(--font-display)] border-2 border-primary/40 rounded-lg transition-all cursor-move select-none",
                currentInput.includes(num.toString())
                  ? "opacity-30 cursor-not-allowed bg-muted/20"
                  : "hover:bg-primary/20 hover:text-primary hover:border-primary",
                draggedNum === num.toString() ? "opacity-60 scale-95" : ""
              )}
              onClick={() => {
                if (!currentInput.includes(num.toString()) && !stageState.isClear && !stageState.isGameOver) {
                  const emptySlot = currentInput.findIndex(v => v === '');
                  if (emptySlot !== -1) {
                    const newInput = [...currentInput];
                    newInput[emptySlot] = num.toString();
                    setCurrentInput(newInput);
                    playSound('click');
                  }
                }
              }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-2">
          <Button 
            variant="destructive" 
            onClick={() => {
              if (currentInput.some(v => v !== '')) {
                setCurrentInput(Array(DIGITS).fill(''));
                playSound('click');
              }
            }}
            className="w-24 font-bold tracking-wider"
          >
            {t('del')}
          </Button>
          <Button 
            variant="default" 
            onClick={handleSubmit}
            disabled={!isInputComplete || stageState.isClear || stageState.isGameOver}
            className={cn(
              "w-32 font-bold tracking-wider text-lg shadow-[0_0_15px_rgba(0,243,255,0.3)]",
              isInputComplete ? "animate-pulse" : ""
            )}
          >
            {t('enter')}
          </Button>
        </div>

        {/* Log Area */}
        <Card className="flex-1 bg-black/40 border-primary/20 p-4 overflow-hidden flex flex-col min-h-[200px]">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest border-b border-primary/10 pb-1">{t('systemLog')}</div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {stageState.guesses.length === 0 && (
              <div className="text-muted-foreground/50 text-center py-8 font-mono text-sm">
                {t('awaitingInput')}
              </div>
            )}
            {[...stageState.guesses].reverse().map((g, i) => (
              <div key={i} className="flex items-center justify-between bg-primary/5 p-2 rounded border border-primary/10 animate-in slide-in-from-left-2 duration-300">
                <div className="font-mono text-lg tracking-widest text-primary-foreground">{g.guess}</div>
                <div className="flex gap-3 font-[family-name:var(--font-display)] font-bold">
                  <div className="flex items-center gap-1 text-chart-3">
                    <span className="text-xs opacity-70">HIT</span>
                    <span className="text-xl">{g.hit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-chart-2">
                    <span className="text-xs opacity-70">BLOW</span>
                    <span className="text-xl">{g.blow}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Result Overlays */}
      {stageState.isClear && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-accent p-8 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.3)] text-center max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-300">
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold text-accent mb-2 animate-pulse">{t('cleared')}</h2>
            <p className="text-muted-foreground mb-6 font-mono">{t('sequenceDecrypted')}</p>
            <div className="text-6xl font-[family-name:var(--font-display)] font-bold text-primary mb-8 tracking-widest">{stageState.answer}</div>
            <Button onClick={nextStage} size="lg" className="w-full font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              {t('nextStage')}
            </Button>
          </div>
        </div>
      )}

      {stageState.isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-destructive/10 border border-destructive p-8 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.2)] text-center max-w-sm w-full mx-4">
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold text-destructive mb-2">{t('failed')}</h2>
            <p className="text-destructive-foreground/80 mb-6 font-mono">{t('systemLocked')}</p>
            <div className="text-4xl font-[family-name:var(--font-display)] font-bold text-muted-foreground mb-2 tracking-widest">{stageState.answer}</div>
            <p className="text-xs text-muted-foreground mb-8">{t('correctSequence')}</p>
            <Button onClick={resetGame} size="lg" variant="destructive" className="w-full font-bold text-lg">
              {t('rebootSystem')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
