import { cloneDeep, get, set } from 'lodash';
import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { TbUsersPlus } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DoubleElimination,
  SingleElimination,
} from '@/features/match/components';
import { useMatchSlice } from '@/features/match/store';
import {
  selectMatchHandling,
  selectMatchOfTournament,
} from '@/features/match/store/selectors';
import { Match } from '@/features/match/types';
import { PlayerEditor } from '@/features/tournament/components';
import { useTournamentSlice } from '@/features/tournament/store';
import {
  selectTournamentData,
  selectTournamentHandling,
} from '@/features/tournament/store/selectors';
import { Player, Tournament } from '@/features/tournament/type';
import { selectUserInformation } from '@/features/user/store/selectors';
import { BracketManager } from '@/lib/bracket';
import { startTutorial } from '@/lib/tutorial';
import { translations } from '@/locales/translations';

const BracketTournament = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useTournamentSlice();
  const { actions: matchActions } = useMatchSlice();
  const { t } = useTranslation();

  const tournament = useSelector((state: any) =>
    selectTournamentData(state, id!),
  );
  const matchInTour = useSelector((state: any) =>
    selectMatchOfTournament(state, id!),
  );
  const userInfor = useSelector(selectUserInformation);

  const handling = useSelector(selectTournamentHandling);
  const matchHandling = useSelector(selectMatchHandling);
  const [selecteType, setSelecteType] = useState<string>('single');
  const [rounds, setRounds] = useState<CustomObject<Match[]>[]>([]);
  const [editPlayer, setEditPlayer] = useState<{ index?: number }>();
  const [cloneTournament, setCloneTournament] = useState<Tournament>();
  const [updateMatch, setUpdateMatch] = useState<CustomObject<Match>>({});

  useEffect(() => {
    if (Object.keys(matchInTour).length === 0) {
      dispatch(matchActions.getMatches({ tournament: id! }));
    }
    if (!tournament) {
      dispatch(actions.getTournament(id!));
    }
  }, []);

  useEffect(() => {
    const tutorial = JSON.parse(localStorage.getItem('tutorial') || '{}');
    if (!tutorial.bracket) {
      startTutorial('bracket')!.drive();
      localStorage.setItem(
        'tutorial',
        JSON.stringify({ ...tutorial, bracket: true }),
      );
    }
  }, []);

  useEffect(() => {
    if (tournament && tournament.organizer.id !== userInfor?.email) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: t(translations.errors.unAuthorized),
      });
      navigate('/');
    }
  }, [tournament, userInfor]);

  useEffect(() => {
    if (tournament) {
      setCloneTournament(tournament);
      const matchsData: CustomObject<Match[]>[] = [];
      tournament.rounds?.forEach((round) => {
        const tmp: CustomObject<Match[]> = {};
        Object.entries(round).forEach(([key, value]) => {
          tmp[key] = value.map((k) => matchInTour[k]);
        });
        matchsData.push(tmp);
      });
      setRounds(matchsData);
    } else {
      dispatch(actions.getTournament(id!));
    }
  }, [tournament]);

  const handleCreate = () => {
    let generateRounds: any[] = [];
    if (selecteType === 'single') {
      generateRounds = BracketManager.generateSingleBracket(
        cloneTournament?.players ?? [],
      );
    }
    if (selecteType === 'double') {
      generateRounds = BracketManager.generateDoubleBracket(
        cloneTournament?.players ?? [],
      );
    }
    setRounds(generateRounds);
  };

  const handleUpdatePlayer = (player: Player) => {
    if (editPlayer?.index) {
      const players = cloneTournament!.players!.map((p, index) =>
        index === editPlayer.index ? player : p,
      );
      setCloneTournament({ ...cloneTournament!, players });
    } else {
      if (
        player.email &&
        cloneTournament?.players?.find((p) => p.email === player.email)
      ) {
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: t(translations.notify.playerExist),
        });
        return;
      }
      setCloneTournament({
        ...cloneTournament!,
        players: [...(cloneTournament?.players || []), player],
      });
    }
    setEditPlayer(undefined);
  };

  const handleSave = () => {
    if (!tournament.status || tournament.status === 'set-up') {
      dispatch(
        actions.saveBracket({
          tournament: {
            ...cloneTournament!,
            format: selecteType as 'single' | 'double',
            status: rounds.length ? 'start' : 'set-up',
          },
          rounds,
        }),
      );
    } else {
      const matchChanges: Match[] = [];
      Object.entries(updateMatch).forEach(([key, value]) => {
        const currentMatch = matchInTour[key];
        const isChange = Object.entries(value).some(([k, v]) => {
          return (
            JSON.stringify(currentMatch[k as keyof Match]) !== JSON.stringify(v)
          );
        });
        if (isChange) {
          matchChanges.push(value);
        }
      });
      if (matchChanges.length) {
        dispatch(matchActions.updateMatches(matchChanges));
      }
    }
  };

  return (
    <>
      {editPlayer ? (
        <PlayerEditor
          onClose={() => setEditPlayer(undefined)}
          onConfirm={handleUpdatePlayer}
          data={
            typeof editPlayer.index === 'number'
              ? cloneTournament?.players[editPlayer.index]
              : undefined
          }
        />
      ) : null}
      {handling || matchHandling ? <Waiting /> : null}
      <div
        className="flex flex-col w-full md:flex-row bg-white"
        style={{ height: window.innerHeight - 72 }}
      >
        {/* Sidebar */}
        <div
          id="bracket-config"
          className="w-64 bg-[#1e2235] text-white p-4 flex flex-col"
        >
          {!tournament?.status || tournament.status === 'set-up' ? (
            <>
              <h2 className="text-sm font-semibold text-start mb-2">
                {t(translations.eliminationType)}
              </h2>
              <div id="elimation-type" className="flex gap-2 mb-2 items-center">
                <Select
                  onValueChange={(v) => setSelecteType(v)}
                  value={selecteType}
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue
                      className="text-gray-400"
                      placeholder="Select Elimination"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="single">Single</SelectItem>
                      {/* <SelectItem value="double">Double</SelectItem> */}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-black"
                  onClick={handleCreate}
                >
                  {t(translations.actions.create)}
                </Button>
              </div>
            </>
          ) : null}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">
              {t(translations.participants)} (
              {cloneTournament?.players?.length || 0})
            </h2>
            {!tournament?.status || tournament.status === 'set-up' ? (
              <Button
                id="add-player"
                variant="outline"
                size="sm"
                className="text-black"
                onClick={() => setEditPlayer({})}
              >
                <TbUsersPlus className="h-4 w-4 mr-2" />
                {t(translations.actions.add)}
              </Button>
            ) : null}
          </div>
          <Input
            placeholder={`${t(translations.actions.search)}...`}
            className="bg-[#2a2f44] border-none text-white mb-4"
          />
          <ScrollArea className="flex-grow">
            {cloneTournament?.players?.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 hover:bg-[#2a2f44] rounded"
              >
                <div className="flex items-center">
                  <span>{player.name}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditPlayer({ index });
                      }}
                    >
                      <FaRegEdit className="mr-2" />
                      {t(translations.actions.edit)}
                    </DropdownMenuItem>
                    {!tournament?.status || tournament.status === 'set-up' ? (
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => {
                          const players = cloneTournament?.players.filter(
                            (p) => p.id !== player.id,
                          );
                          setCloneTournament({
                            ...cloneTournament!,
                            players,
                          });
                        }}
                      >
                        <FaRegTrashAlt className="mr-2" />
                        {t(translations.actions.delete)}
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </ScrollArea>
          <Button
            id="save-bracket"
            variant="outline"
            className="mt-4 text-gray-600 border-dashed border-white/20"
            onClick={handleSave}
          >
            {t(translations.actions.save)}
          </Button>
        </div>

        {/* Main content */}
        {rounds.length ? (
          <div id="bracket-view" className={'flex-1 h-full overflow-hidden'}>
            {selecteType === 'single' ? (
              <SingleElimination
                rounds={rounds as { matches: Match[] }[]}
                allowEdit
                isStart={tournament?.status !== 'set-up'}
                players={cloneTournament?.players || []}
                onSubmitEdit={(roundIndex, data) => {
                  const matchUpdate: CustomObject<Match> = {};
                  const newRounds = [...rounds];
                  const matchIndex = newRounds[roundIndex].matches.findIndex(
                    (m) => m.id === data.id,
                  );
                  set(newRounds, `${roundIndex}.matches.${matchIndex}`, data);
                  matchUpdate[data.id] = data;
                  if (data.winner) {
                    if (data.winMatch) {
                      const playerWin = get(data, ['players', data.winner - 1]);
                      const [nextRoundIndex, nextMatchIndex] =
                        data.winMatch.split('-');
                      const nextMatch: Match = get(
                        newRounds,
                        [nextRoundIndex, 'matches', nextMatchIndex],
                        {},
                      );
                      const nextRoundPlayers =
                        cloneDeep(nextMatch.players) || [];
                      nextRoundPlayers.push(playerWin);
                      set(
                        newRounds,
                        `${nextRoundIndex}.matches.${nextMatchIndex}`,
                        {
                          ...nextMatch,
                          players: nextRoundPlayers,
                        },
                      );
                      matchUpdate[nextMatch.id] = {
                        ...nextMatch,
                        players: nextRoundPlayers,
                      };
                    }
                  }
                  setRounds(newRounds);
                  if (matchInTour[data.id]) {
                    setUpdateMatch((pre) => ({ ...pre, ...matchUpdate }));
                  }
                }}
              />
            ) : null}
            {selecteType === 'double' ? (
              <DoubleElimination
                rounds={
                  rounds as any
                  // {
                  //   winnersBracket: Match[];
                  //   losersBracket: Match[];
                  // }[]
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default BracketTournament;
