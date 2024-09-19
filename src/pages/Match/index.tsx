import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { FaBan, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { determineTurn } from '@/lib/utils';

const Match = () => {
  const navigate = useNavigate();
  const [numBans, setNumBans] = useState(2);
  const [numPicks, setNumPicks] = useState(2);

  const [order, setOrder] = useState<{ player: number; type: string }[]>([]);

  const formSchema = z.object({
    numBans: z.string(),
    numPicks: z.string(),
    firstPick: z.string(),
    goFirst: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numBans: '2',
      numPicks: '2',
      firstPick: 'player1',
      goFirst: 'player1',
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const matchInfo = {
      firstPick: values.firstPick,
      goFirst: values.goFirst,
      turn: order,
    };
    navigate('/match/start', { state: { matchInfo } });
  };

  useEffect(() => {
    const newOrder = determineTurn(numBans, numPicks);
    console.log(newOrder);

    setOrder(newOrder);
  }, [numBans, numPicks]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrder(items);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Match Creation</h1>
      <div
        className="grid grid-cols-2 gap-4"
        style={{
          height: 'calc(100vh - 220px)',
        }}
      >
        <div className="overflow-y-scroll no-scrollbar">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="orderList">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white rounded-lg shadow p-4"
                >
                  {order.map((item, index) => (
                    <Draggable
                      key={`item-${index}`}
                      draggableId={`item-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center justify-between p-3 mb-2 rounded-md ${snapshot.isDragging ? 'bg-blue-100' : item.type === 'ban' ? 'bg-red-100' : 'bg-green-100'} transition-colors duration-200 ease-in-out`}
                        >
                          <span className="flex items-center text-xs font-bold">
                            {item.type === 'ban' ? (
                              <FaBan className="text-red-500 mr-2" />
                            ) : (
                              <FaCheck className="text-green-500 mr-2" />
                            )}
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}{' '}
                            {index + 1}
                            {item.player === 1 ? ' (Player 1)' : ' (Player 2)'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            Drag to reorder
                          </span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <h2 className="text-2xl font-bold">Match Details</h2>
              <div className="grid grid-cols-2 gap-5 text-start">
                <FormField
                  control={form.control}
                  name="numBans"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Bans</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setNumBans(parseInt(value));
                          field.onChange(value);
                        }}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[2, 4, 6, 8, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numPicks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Picks</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setNumPicks(parseInt(value));
                          field.onChange(value);
                        }}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[2, 4, 6, 8, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
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
                  name="firstPick"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Pick</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['player1', 'player2'].map((player) => (
                            <SelectItem key={player} value={player}>
                              {player.charAt(0).toUpperCase() + player.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goFirst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Go First</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['player1', 'player2'].map((player) => (
                            <SelectItem key={player} value={player}>
                              {player.charAt(0).toUpperCase() + player.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Match;
