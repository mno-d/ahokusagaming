import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useSound } from '@/hooks/useSound';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Tutorial() {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(0);
  const { playSound } = useSound();
  const { t } = useLanguage();

  const steps = [
    {
      title: t('tutorialTitle'),
      desc: t('tutorialDesc1')
    },
    {
      title: t('tutorialTitle2'),
      desc: (
        <div className="space-y-2 text-left">
          <p>{t('tutorialDesc2')}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-accent font-bold">HIT</span>: {t('tutorialHit')}</li>
            <li><span className="text-chart-2 font-bold">BLOW</span>: {t('tutorialBlow')}</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">{t('tutorialExample')}</p>
        </div>
      )
    },
    {
      title: t('tutorialTitle3'),
      desc: t('tutorialDesc3')
    }
  ];

  const handleNext = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-primary/50 bg-black/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-[family-name:var(--font-display)] text-primary tracking-wider">
            {steps[step].title}
          </DialogTitle>
          <DialogDescription className="text-lg pt-4 font-mono text-foreground/90">
            {steps[step].desc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between items-center mt-4">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-accent' : 'bg-muted'}`} />
            ))}
          </div>
          <Button onClick={handleNext} className="font-bold min-w-[100px]">
            {step === steps.length - 1 ? t('tutorialStart') : t('tutorialNext')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
