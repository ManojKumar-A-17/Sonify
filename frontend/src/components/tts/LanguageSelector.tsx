import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages } from '@/lib/languages';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-12 w-full rounded-2xl border-border/60 bg-background/70 shadow-soft">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-border/60 bg-card shadow-large">
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="cursor-pointer rounded-xl focus:bg-primary/10 focus:text-primary"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
