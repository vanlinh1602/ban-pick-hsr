import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('en');

  const handleChange = (target: string) => {
    setValue(target);
    localStorage.setItem('language', target);
    i18n.changeLanguage(target);
    setOpen(false);
  };

  useEffect(() => {
    const language = localStorage.getItem('language');
    if (language) {
      setValue(language || 'en');
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="language-selector"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {value
            ? languages.find((language) => language.value === value)?.label
            : 'Select language...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  onSelect={() => {
                    handleChange(language.value);
                  }}
                >
                  {language.flag} {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
