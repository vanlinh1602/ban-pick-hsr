import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { translations } from '@/locales/translations';

type Props = {
  options: { value: string; label: string; icons?: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
  value?: string;
};

export default function SearchableSelect({
  options,
  onSelect,
  placeholder,
  value,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<{
    value: string;
    label: string;
    icons?: string;
  }>();

  useEffect(() => {
    if (value) {
      const selectedValue = options.find((option) => option.value === value);
      if (selectedValue) {
        setSelectValue(selectedValue);
      }
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-normal"
        >
          {selectValue ? (
            <div className="flex">
              {selectValue.icons && (
                <img
                  src={selectValue.icons}
                  alt={selectValue.label}
                  className="w-5 h-5 mr-2 rounded-full"
                />
              )}
              {selectValue.label}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 text-ellipsis">
        <Command>
          <CommandInput placeholder={`${t(translations.actions.search)}...`} />
          <CommandList>
            <CommandEmpty>{t(translations.notify.noResult)}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    setSelectValue(option);
                    onSelect(option.value);
                    setOpen(false);
                  }}
                >
                  <img
                    src={option.icons}
                    alt={option.label}
                    className="w-5 h-5 mr-2 rounded-full"
                  />
                  <span className="text-ellipsis">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
