import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from '@/components/hooks/use-toast';
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
import { Match } from '@/features/match/types';
import { Player } from '@/features/tournament/type';
import { cn } from '@/lib/utils';

type Props = {
  match: Match;
  allPlayers: Player[];
  onClose: () => void;
  onSubmit: (match: Match) => void;
};

export const MatchEditorModal = ({
  match,
  onClose,
  allPlayers,
  onSubmit,
}: Props) => {
  const formSchema = z.object({
    player1: z.string().optional(),
    player2: z.string().optional(),
    date: z.date().optional(),
    winner: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: match.date ? new Date(match.date) : new Date(),
      player1: match.players[0]?.id || '',
      player2: match.players[1]?.id || '',
      winner: match.winner?.toString() || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.player1 && values.player2 && values.player1 === values.player2) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Player 1 and Player 2 must be different',
      });
      return;
    }
    const player1 = allPlayers.find((player) => player.id === values.player1);
    const player2 = allPlayers.find((player) => player.id === values.player2);
    const matchUpdate: Match = {
      ...match,
      date: values.date?.getTime() || Date.now(),
      players: [player1!, player2!],
      winner: values.winner ? parseInt(values.winner) : undefined,
    };
    onSubmit(matchUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">Match Editor</h3>
        <div className="text-start">
          <Form {...form}>
            <form className="space-y-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel className="text-gray-700 font-bold">
                      Date of Match
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
                            {field.value ? (
                              format(field.value, 'd/L/y')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
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
              <FormField
                control={form.control}
                name="player1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player 1</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a players" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allPlayers.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="player2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player 2</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a players" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allPlayers.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="winner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Winner</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a players" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {match.players.map((player, index) => (
                          <SelectItem
                            key={player.id}
                            value={(index + 1).toString()}
                          >
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="space-x-5 mt-5">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
