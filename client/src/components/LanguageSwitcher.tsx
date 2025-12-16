import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:border-primary/60">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent/20' : ''}>
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ja')} className={language === 'ja' ? 'bg-accent/20' : ''}>
          {t('japanese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
