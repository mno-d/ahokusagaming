import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MAX_TURNS, DIGITS } from '@/lib/game-constants';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';
import Tutorial from '@/components/Tutorial';

export default function GameScreen() {
  const { runState, stageState, submitGuess, giveUp, nextStage, resetGame } = useGame();
  const { playSound } = useSound();
  const [currentInput, setCurrentInput] = useState<string[]>(Array(DIGITS).fill(''));
  const [selectedSlot, setSelectedSlot] = useState<number>(0);

  // Reset input when stage changes
  useEffect(() => {
    setCurrentInput(Array(DIGITS).fill(''));
    setSelectedSlot(0);
  }, [stageState?.turn, stageState?.isClear]);

  if (!runState || !stageState) return null;

  const handleNumClick = (num: number) => {
    if (stageState.isClear || stageState.isGameOver) return;
    
    // Check if number is already used
    if (currentInput.includes(num.toString())) {
      playSound('error');
      return;
    }
    playSound('click');

    const newInput = [...currentInput];
    newInput[selectedSlot] = num.toString();
    setCurrentInput(newInput);

    // Move to next empty slot
    const nextEmpty = newInput.findIndex(v => v === '');
    if (nextEmpty !== -1) {
      setSelectedSlot(nextEmpty);
    } else {
      // If all filled, stay on last or loop? Let's stay on last for now
      setSelectedSlot(DIGITS - 1);
    }
  };

  const handleBackspace = () => {
    if (stageState.isClear || stageState.isGameOver) return;
    playSound('click');
    const newInput = [...currentInput];
    if (newInput[selectedSlot] !== '') {
      newInput[selectedSlot] = '';
    } else if (selectedSlot > 0) {
      newInput[selectedSlot - 1] = '';
      setSelectedSlot(selectedSlot - 1);
    }
    setCurrentInput(newInput);
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
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Stage</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-primary font-bold">{runState.stage}</div>
        </div>
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-accent font-bold">{runState.score}</div>
        </div>
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Turn</div>
          <div className="text-2xl font-[family-name:var(--font-display)] text-secondary-foreground font-bold">
            {stageState.turn} <span className="text-sm text-muted-foreground">/ {MAX_TURNS}</span>
          </div>
        </div>
        <div className="bg-card/80 border border-primary/30 p-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Combo</div>
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
              onClick={() => setSelectedSlot(idx)}
              className={cn(
                "w-16 h-20 md:w-20 md:h-24 border-2 rounded-xl flex items-center justify-center text-4xl font-[family-name:var(--font-display)] transition-all duration-200 cursor-pointer backdrop-blur-md",
                selectedSlot === idx 
                  ? "border-accent shadow-[0_0_20px_rgba(255,0,255,0.4)] bg-accent/10 scale-105" 
                  : "border-primary/30 bg-card/50 hover:border-primary/60",
                num !== '' ? "text-foreground" : "text-muted"
              )}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-md mx-auto w-full">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className={cn(
                "h-14 text-xl font-[family-name:var(--font-display)] border-primary/40 hover:bg-primary/20 hover:text-primary hover:border-primary transition-all",
                currentInput.includes(num.toString()) && "opacity-30 cursor-not-allowed"
              )}
              onClick={() => handleNumClick(num)}
              disabled={currentInput.includes(num.toString())}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-2">
          <Button 
            variant="destructive" 
            onClick={handleBackspace}
            className="w-24 font-bold tracking-wider"
          >
            DEL
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
            ENTER
          </Button>
        </div>

        {/* Log Area */}
        <Card className="flex-1 bg-black/40 border-primary/20 p-4 overflow-hidden flex flex-col min-h-[200px]">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-widest border-b border-primary/10 pb-1">System Log</div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {stageState.guesses.length === 0 && (
              <div className="text-muted-foreground/50 text-center py-8 font-mono text-sm">
                Awaiting input sequence...
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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onAnimationStart={() => playSound('clear')}>
          <div className="bg-card border border-accent p-8 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.3)] text-center max-w-sm w-full mx-4 transform animate-in zoom-in-95 duration-300">
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold text-accent mb-2 animate-pulse">CLEARED!</h2>
            <p className="text-muted-foreground mb-6 font-mono">Sequence Decrypted</p>
            <div className="text-6xl font-[family-name:var(--font-display)] font-bold text-primary mb-8 tracking-widest">{stageState.answer}</div>
            <Button onClick={nextStage} size="lg" className="w-full font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              NEXT STAGE
            </Button>
          </div>
        </div>
      )}

      {stageState.isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-destructive/10 border border-destructive p-8 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.2)] text-center max-w-sm w-full mx-4">
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold text-destructive mb-2">FAILED</h2>
            <p className="text-destructive-foreground/80 mb-6 font-mono">System Locked</p>
            <div className="text-4xl font-[family-name:var(--font-display)] font-bold text-muted-foreground mb-2 tracking-widest">{stageState.answer}</div>
            <p className="text-xs text-muted-foreground mb-8">Correct Sequence</p>
            <Button onClick={resetGame} size="lg" variant="destructive" className="w-full font-bold text-lg">
              REBOOT SYSTEM
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
