import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
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
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Tournament } from '@/features/tournament/type';
import { cn } from '@/lib/utils';

type Props = {
  onClose: () => void;
  onConfirm: (data: Partial<Tournament>) => void;
  data?: Tournament;
};

const EditTournament = ({ onClose, onConfirm, data }: Props) => {
  const formSchema = z.object({
    name: z.string().min(1),
    date: z.object({
      from: z.date(),
      to: z.date().optional(),
    }),
    organizer: z.string().min(1),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      date: {
        from: new Date(data?.date.from || Date.now()),
        to: data?.date.to ? new Date(data.date.to) : undefined,
      },
      organizer: data?.organizer || '',
      description: data?.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tournamentUpdate: Partial<Tournament> = {
      ...data,
      name: values.name,
      date: {
        from: values.date.from.getTime(),
        to: values.date.to?.getTime(),
      },
      organizer: values.organizer,
      description: values.description,
    };
    onConfirm(tournamentUpdate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {data?.id ? 'Edit' : 'Create'} Tournament
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Tournament Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Tournament Name" {...field} />
                  </FormControl>
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
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="date"
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, 'd/L/y')} -{' '}
                                {format(field.value.to, 'd/L/y')}
                              </>
                            ) : (
                              format(field.value.from, 'd/L/y')
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        defaultMonth={field.value?.from}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Organizer
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Input organizer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of the tournament"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditTournament;
