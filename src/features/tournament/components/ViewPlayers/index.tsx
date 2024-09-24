import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { toast } from '@/components/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useTournamentSlice } from '../../store';
import { selectTournamentData } from '../../store/selectors';
import { Player } from '../../type';
import PlayerEditor from '../PlayerEditor';

type Props = {
  tournamentId: string;
  onClose: () => void;
};

const ViewPLayers = ({ onClose, tournamentId }: Props) => {
  const dispatch = useDispatch();
  const { actions } = useTournamentSlice();
  const tournament = useSelector((state: any) =>
    selectTournamentData(state, tournamentId),
  );
  const [addPlayer, setAddPlayer] = useState<{ player?: Player }>();

  const handleAddPlayer = (player: Player) => {
    if (
      addPlayer?.player &&
      tournament?.players?.find((p) => p.email === player.email)
    ) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Player already exists',
      });
      return;
    }
    let playersUpdate: Player[];
    if (addPlayer?.player) {
      playersUpdate = tournament?.players?.map((p) =>
        p.id === player.id ? player : p,
      );
    } else {
      const currentPlayers = tournament?.players || [];
      playersUpdate = [...currentPlayers, player];
    }
    dispatch(
      actions.updateTournament({ id: tournamentId, players: playersUpdate }),
    );
    setAddPlayer(undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      {addPlayer ? (
        <PlayerEditor
          onClose={() => setAddPlayer(undefined)}
          onConfirm={handleAddPlayer}
          data={addPlayer.player}
        />
      ) : null}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Player List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 max-h-96 overflow-y-scroll no-scrollbar">
            {tournament?.players?.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between text-start space-x-4"
              >
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback>
                      {player.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <h3 className="text-sm font-medium leading-none">
                      {player.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {player.email}
                    </p>
                  </div>
                </div>
                <div className="flex float-right">
                  <FaEdit
                    className="text-blue-500 hover:text-blue-700 transition"
                    onClick={() => setAddPlayer({ player })}
                  />
                  <FaTrash
                    className="text-red-500 hover:text-red-700 transition ml-2"
                    onClick={() => {
                      const players = tournament?.players?.filter(
                        (p) => p.id !== player.id,
                      );
                      dispatch(
                        actions.updateTournament({ id: tournamentId, players }),
                      );
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {!tournament?.players?.length ? (
            <p className="text-muted-foreground text-center mt-4">
              PLayer list is empty
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button size="sm" variant="destructive" onClick={onClose}>
            Close
          </Button>
          <div>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-500"
              onClick={() => setAddPlayer({})}
            >
              Add Player
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ViewPLayers;
