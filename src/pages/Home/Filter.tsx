import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { translations } from '@/locales/translations';

type Props = {
  onFilter: ({ status, date }: { status?: string; date?: number }) => void;
  onClose: () => void;
};

export const Filter = ({ onClose, onFilter }: Props) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    status: z.string().optional(),
    date: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFilter({
      status: values.status,
      date: values.date?.getTime(),
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    {t(translations.status)}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger spellCheck>
                        <SelectValue
                          placeholder={t(translations.actions.select)}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(translations.tournament.status).map(
                        ([key, text]) => (
                          <SelectItem key={key} value={key}>
                            {t(text)}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    {t(translations.date)}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'd/L/y')
                          ) : (
                            <span>{t(translations.pickADate)}</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        defaultMonth={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <div className="space-x-4">
              <Button variant="secondary" onClick={onClose}>
                {t(translations.actions.cancel)}
              </Button>
              <Button type="submit">{t(translations.actions.submit)}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
