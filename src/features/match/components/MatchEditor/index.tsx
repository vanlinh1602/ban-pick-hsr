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
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMatchSlice } from '@/features/match/store';
import { Match as MatchType } from '@/features/match/types';
import { determineTurn, generateID } from '@/lib/utils';
import { socket } from '@/services/socket';

import { selectMatchData } from '../../store/selectors';

type Props = {
  id?: string;
  type?: string;
};

const MatchEditor = ({ id }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useMatchSlice();
  const [numBans, setNumBans] = useState(2);
  const [numPicks, setNumPicks] = useState(2);
  const [firstPick, setFirstPick] = useState(1);
  const [order, setOrder] = useState<{ player: number; type: string }[]>([]);

  const matchData = useSelector((state: any) =>
    selectMatchData(state, id || ''),
  );

  useEffect(() => {
    const newOrder = determineTurn(numBans, numPicks, firstPick);
    setOrder(newOrder);
  }, [numBans, numPicks, firstPick]);

  useEffect(() => {
    if (matchData?.matchSetup?.banPickStatus) {
      setOrder(matchData.matchSetup.banPickStatus);
    }
  }, [matchData]);

  const formSchema = z.object({
    numBans: z.string(),
    numPicks: z.string(),
    firstPick: z.string(),
    goFirst: z.string(),
    player1: z.string(),
    player2: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numBans:
        matchData?.matchSetup?.banPickStatus
          ?.filter((item: any) => item.type === 'ban')
          .length.toString() || '2',
      numPicks:
        matchData?.matchSetup?.banPickStatus
          ?.filter((item: any) => item.type === 'pick')
          .length.toString() || '2',
      firstPick: matchData?.matchSetup?.firstPick.toString() || '1',
      goFirst: matchData?.matchSetup?.goFirst.toString() || '1',
      player1: matchData?.players?.[0].name || 'Player 1',
      player2: matchData?.players?.[1].name || 'Player 2',
    },
  });

  const onSubmit = (
    values: z.infer<typeof formSchema>,
    action: 'create' | 'update' | 'start',
  ) => {
    const matchInfo: Partial<MatchType> = {
      players: matchData?.players ?? [
        {
          email: '',
          name: values.player1,
          id: generateID(),
        },
        {
          email: '',
          name: values.player2,
          id: generateID(),
        },
      ],
      status: 'set-up',
      matchSetup: {
        firstPick: Number(values.firstPick),
        goFirst: Number(values.goFirst),
        banPickStatus: order.map((item) => ({
          player: item.player,
          type: item.type as 'ban' | 'pick',
        })),
      },
    };
    if (id) {
      if (action === 'update') {
        dispatch(actions.updateMatch({ id, ...matchInfo }));
      }
      if (action === 'start') {
        dispatch(
          actions.modifyMatch({
            id,
            patch: [],
            data: {
              id,
              ...matchInfo,
              status: 'ban-pick',
            },
          }),
        );
        socket.emit('syncMatch', {
          room: id,
          match: {
            id,
            ...matchInfo,
            status: 'ban-pick',
          },
        });
      }
    } else {
      matchInfo.status = 'ban-pick';
      dispatch(
        actions.createMatch({
          matchInfo,
          onSuccess: (matchId) => {
            navigate(`/match/${matchId}`);
          },
        }),
      );
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrder(items);
  };

  return (
    <div
      className="flex flex-col md:grid md:grid-cols-2 gap-4 overflow-y-scroll no-scrollbar"
      style={{
        height: 'calc(100vh - 220px)',
      }}
    >
      <div className="bg-white rounded-lg shadow p-4">
        <Form {...form}>
          <form className="space-y-8">
            <h2 className="text-2xl font-bold">Match Details</h2>
            <div className="grid grid-cols-2 gap-5 text-start">
              <FormField
                control={form.control}
                name="player1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="player2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PLayer Name 2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      onValueChange={(value) => {
                        setFirstPick(parseInt(value));
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
                        {['1', '2'].map((player) => (
                          <SelectItem key={player} value={player}>
                            Player {player}
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
                        {['1', '2'].map((player) => (
                          <SelectItem key={player} value={player}>
                            Player {player}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
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
            </div>
          </form>
        </Form>
        <div className="mt-4">
          {id ? (
            <>
              <Button
                onClick={() => {
                  const values = form.getValues();
                  onSubmit(values, 'update');
                }}
              >
                Update
              </Button>
              <Button
                className="ml-5"
                onClick={() => {
                  const values = form.getValues();
                  onSubmit(values, 'start');
                }}
              >
                Start
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                const values = form.getValues();
                onSubmit(values, 'create');
              }}
            >
              Create
            </Button>
          )}
        </div>
      </div>
      <div className="md:overflow-y-scroll md:no-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="orderList">
            {(providedParent) => (
              <div
                {...providedParent.droppableProps}
                ref={providedParent.innerRef}
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
                          {item.player === 1 ? ' (Player 1)' : ' (Player 2)'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Drag to reorder
                        </span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {providedParent.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default MatchEditor;
