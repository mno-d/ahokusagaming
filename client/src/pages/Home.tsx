import { GameProvider, useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import GameScreenDragDrop from "@/components/GameScreenDragDrop";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function GameContent() {
  const { runState, startGame } = useGame();
  const { t, language, setLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);

  if (!runState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/images/bg-main.jpg')] bg-cover bg-center opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background pointer-events-none" />
        
        {/* Settings Button */}
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-primary/30 hover:border-primary/60 hover:bg-primary/10"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('language')}
                </p>
              </div>
              <DropdownMenuItem
                onClick={() => setLanguage('ja')}
                className={language === 'ja' ? 'bg-primary/20' : ''}
              >
                <span>🇯🇵 {t('japanese')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-primary/20' : ''}
              >
                <span>🇺🇸 {t('english')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="relative z-10 text-center max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse tracking-tighter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
              {t('title')}
            </h1>
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-secondary-foreground tracking-widest uppercase opacity-80">
              {t('subtitle')}
            </h2>
          </div>
          
          <div className="p-6 border border-primary/20 bg-black/40 backdrop-blur-md rounded-xl shadow-2xl">
            <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6">
              {t('description')}
            </p>
            
            <Button 
              onClick={startGame} 
              size="lg" 
              className="w-full text-xl font-bold h-16 bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,243,255,0.6)]"
            >
              {t('initializeRun')}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground/40 font-mono">
            {t('systemVersion')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[url('/images/bg-main.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
      <div className="relative z-10 flex-1 flex flex-col">
        <header className="p-4 border-b border-primary/10 bg-black/20 backdrop-blur-sm flex justify-between items-center">
          <div className="font-[family-name:var(--font-display)] font-bold text-lg text-primary tracking-wider">{t('title')} <span className="text-xs opacity-50 ml-2">RL</span></div>
          <LanguageSwitcher />
        </header>
        <main className="flex-1 flex items-center">
          <GameScreenDragDrop />
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
