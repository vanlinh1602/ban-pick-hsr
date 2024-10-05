import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaAudioDescription,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaRegEdit,
  FaSearch,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa';
import { GoOrganization } from 'react-icons/go';
import { VscOrganization } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DoubleElimination,
  SingleElimination,
} from '@/features/match/components';
import { useMatchSlice } from '@/features/match/store';
import { selectMatchOfTournament } from '@/features/match/store/selectors';
import { Match } from '@/features/match/types';
import { EditTournament } from '@/features/tournament/components';
import { useTournamentSlice } from '@/features/tournament/store';
import { selectTournamentData } from '@/features/tournament/store/selectors';
import { selectUserInformation } from '@/features/user/store/selectors';
import { translations } from '@/locales/translations';
type TournamentData = {
  players: {
    name: string;
    ranking: number;
    points: number;
    matchesWon: number;
  }[];
  upcomingMatches: Match[];
  completedMatches: Match[];
};

const TournamentDetails = () => {
  const navigator = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { actions: matchActions } = useMatchSlice();
  const { actions: tournamentActions } = useTournamentSlice();
  const tournament = useSelector((state: any) =>
    selectTournamentData(state, id!),
  );
  const tournamentMatches = useSelector((state: any) =>
    selectMatchOfTournament(state, id!),
  );
  const userInfo = useSelector(selectUserInformation);

  const [expandedMatch, setExpandedMatch] = useState<string>();
  const [rounds, setRounds] = useState<CustomObject<Match[]>[]>([]);
  const [sortCriteria, setSortCriteria] = useState('matchesWon');
  const [isEditing, setIsEditing] = useState(false);
  // const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    dispatch(matchActions.getMatches({ tournament: id! }));
    if (!tournament) {
      dispatch(tournamentActions.getTournament(id!));
    }
  }, []);

  useEffect(() => {
    if (tournament && Object.keys(tournamentMatches).length) {
      const matchsData: CustomObject<Match[]>[] = [];
      tournament.rounds?.forEach((round) => {
        const tmp: CustomObject<Match[]> = {};
        Object.entries(round).forEach(([key, value]) => {
          tmp[key] = value.map((k: string) => tournamentMatches[k]);
        });
        matchsData.push(tmp);
      });
      setRounds(matchsData);
    }
  }, [tournament, tournamentMatches]);

  const { players, upcomingMatches, completedMatches }: TournamentData =
    useMemo(() => {
      const initialData: {
        players: CustomObject<{
          name: string;
          points: number;
          matchesWon: number;
        }>;
        upcomingMatches: Match[];
        completedMatches: Match[];
      } = {
        players:
          tournament?.players?.reduce(
            (acc, player) => ({
              ...acc,
              [player.id]: {
                name: player.name,
                points: 0,
                matchesWon: 0,
              },
            }),
            {},
          ) || {},
        upcomingMatches: [],
        completedMatches: [],
      };

      const now = Date.now();

      tournament?.rounds?.forEach((round) => {
        Object.values(round).forEach((matches) => {
          matches.forEach((matchId) => {
            const match = tournamentMatches[matchId];
            if (!match) return;
            const { players: matchPlayers, winner, games, date } = match;
            const gameResults = games?.reduce(
              (acc, game) => {
                const { player, points } = game;
                acc[player - 1].points += points;

                return acc;
              },
              [{ points: 0 }, { points: 0 }] as { points: number }[],
            );
            matchPlayers?.forEach((player, index) => {
              if (!initialData.players[player.id]) {
                initialData.players[player.id] = {
                  name: player.name,
                  points: 0,
                  matchesWon: 0,
                };
              }
              initialData.players[player.id].points +=
                gameResults?.[index]?.points || 0;
              if (winner === index + 1) {
                initialData.players[player.id].matchesWon += 1;
              }
            });
            if (match.players.length === 2) {
              if (date && date >= now) {
                initialData.upcomingMatches.push(match);
              } else {
                initialData.completedMatches.push(match);
              }
            }
          });
        });
      });

      return {
        players: Object.values(initialData.players)
          .sort((a, b) => a.matchesWon - b.matchesWon)
          .map((player, index) => ({ ...player, ranking: index + 1 })),
        upcomingMatches: initialData.upcomingMatches,
        completedMatches: initialData.completedMatches,
      };
    }, [tournament, tournamentMatches]);

  const sortedPlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        if (sortCriteria === 'points') return b.points - a.points;
        if (sortCriteria === 'matchesWon') return b.matchesWon - a.matchesWon;
        return 0;
      }),
    [players, sortCriteria],
  );

  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatch((pre) => (pre === matchId ? undefined : matchId));
  };

  return (
    <>
      {isEditing && (
        <EditTournament
          onClose={() => setIsEditing(false)}
          onConfirm={(data) => {
            const tournamentUpdate = {
              ...tournament,
              ...data,
            };
            dispatch(tournamentActions.updateTournament(tournamentUpdate));
            setIsEditing(false);
          }}
          data={tournament}
          user={userInfo!}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-3 mb-8">
          <div></div>
          <h1 className="text-4xl font-bold  text-center">
            {tournament?.name}
          </h1>
          {userInfo?.email === tournament?.organizer?.id ? (
            <div className="flex justify-end items-center">
              <FaRegEdit
                className="text-xl text-primary"
                onClick={() => setIsEditing(true)}
              />
            </div>
          ) : null}
        </div>
        <section
          className="mb-10 bg-white rounded-lg shadow-lg p-6"
          aria-labelledby="structure-title"
        >
          <h2
            id="structure-title"
            className="text-lg font-semibold mb-4 flex items-center"
          >
            <FaAudioDescription className="mr-2 text-primary" />
            {t(translations.descriptions)}:{' '}
            <span className="ml-2 font-normal">{tournament?.description}</span>
          </h2>
          <h2
            id="structure-title"
            className="text-lg font-semibold mb-4 flex items-center"
          >
            <FaCalendarAlt className="mr-2 text-primary" />
            {t(translations.date)}:{' '}
            <span className="ml-2 font-normal">
              {format(tournament?.date?.from || Date.now(), 'd/L/y')}
              {tournament?.date?.to
                ? ` - ${format(tournament.date.to, 'd/L/y')}`
                : ''}
            </span>
          </h2>
          <h2
            id="structure-title"
            className="text-lg font-semibold mb-4 flex items-center"
          >
            <GoOrganization className="mr-2 text-primary" />
            {t(translations.organizer)}:{' '}
            <span className="ml-2 font-normal">
              {tournament?.organizer?.name}
            </span>
          </h2>
          <h2
            id="structure-title"
            className="text-lg font-semibold flex items-center"
          >
            <VscOrganization className="mr-2 text-primary" />
            {t(translations.numberOfParticipants)}:{' '}
            <span className="ml-2 font-normal">
              {tournament?.players?.length || 0}
            </span>
          </h2>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section
            className="bg-white rounded-lg shadow-lg p-6"
            aria-labelledby="rankings-title"
          >
            <div className="flex justify-between">
              <h2
                id="rankings-title"
                className="text-2xl font-semibold mb-4 flex items-center"
              >
                <FaTrophy className="mr-2 text-yellow-500" />{' '}
                {t(translations.playerRankings)}
              </h2>
              {/* <Button
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setShowPlayer(true)}
              >
                {t(translations.viewPlayers)}
              </Button> */}
            </div>
            <div className="mb-4 flex flex-col items-start justify-start md:flex-row md:justify-between md:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players"
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Search players"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary mt-1 md:mt-0"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                aria-label="Sort criteria"
              >
                <option value="points">{t(translations.points)}</option>
                <option value="matchesWon">{t(translations.matchWon)}</option>
              </select>
            </div>
            <ul className="space-y-2 max-h-80 overflow-y-scroll no-scrollbar">
              {sortedPlayers.map((player, index) => (
                <li
                  key={player.name}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="font-medium">{player.name}</span>
                  <div className="flex space-x-4">
                    <span className="text-sm text-gray-600">
                      {t(translations.ranking)}: {index + 1}
                    </span>
                    <span className="text-sm text-gray-600">
                      {t(translations.points)}: {player.points}
                    </span>
                    <span className="text-sm text-gray-600">
                      {t(translations.matchWon)}: {player.matchesWon}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section
            className="bg-white rounded-lg shadow-lg p-6"
            aria-labelledby="matches-title"
          >
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  {t(translations.upcomingMatch)}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  {t(translations.completedMatch)}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <ul className="space-y-4 max-h-96 overflow-y-scroll no-scrollbar">
                  {upcomingMatches.map((match) => (
                    <li
                      key={match.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => toggleMatchExpansion(match.id)}
                        aria-expanded={expandedMatch === match.id}
                        aria-controls={`match-details-${match.id}`}
                      >
                        <div>
                          <span className="font-medium">
                            {match.players[0]?.name}
                          </span>{' '}
                          vs{' '}
                          <span className="font-medium">
                            {match.players[1]?.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            {format(match.date || Date.now(), 'd/L/y')}
                          </span>
                          {expandedMatch === match.id ? (
                            <FaChevronUp className="text-gray-600" />
                          ) : (
                            <FaChevronDown className="text-gray-600" />
                          )}
                        </div>
                      </div>
                      {expandedMatch === match.id && (
                        <div
                          id={`match-details-${match.id}`}
                          className="p-4 bg-white flex justify-between"
                        >
                          <div>
                            <p className="text-sm text-gray-600 text-start">
                              <b className="mr-1">{t(translations.status)}: </b>
                              {t(translations.matchStatus[match.status])}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 text-start">
                              <b className="mr-1">{t(translations.winner)}: </b>
                              {match.winner
                                ? match.players[match.winner - 1].name
                                : '----'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 text-start">
                              <b className="mr-1">
                                {t(translations.totalRound)}:
                              </b>
                              {match.games?.length || 0}
                            </p>
                          </div>
                          <Button
                            className="mt-4"
                            onClick={() => navigator(`/match/${match.id}`)}
                          >
                            {t(translations.actions.view)}
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                  {!upcomingMatches.length ? (
                    <p className="text-gray-600 mt-4">
                      {t(translations.notify.noUpcomingMatches)}
                    </p>
                  ) : null}
                </ul>
              </TabsContent>
              <TabsContent value="completed">
                <ul className="space-y-4 max-h-96 overflow-y-scroll no-scrollbar">
                  {completedMatches.map((match) => (
                    <li
                      key={match.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => toggleMatchExpansion(match.id)}
                        aria-expanded={expandedMatch === match.id}
                        aria-controls={`match-details-${match.id}`}
                      >
                        <div>
                          <span className="font-medium">
                            {match.players?.[0]?.name}
                          </span>{' '}
                          vs{' '}
                          <span className="font-medium">
                            {match.players?.[1]?.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            {format(match.date || Date.now(), 'd/L/y')}
                          </span>
                          {expandedMatch === match.id ? (
                            <FaChevronUp className="text-gray-600" />
                          ) : (
                            <FaChevronDown className="text-gray-600" />
                          )}
                        </div>
                      </div>
                      {expandedMatch === match.id && (
                        <div
                          id={`match-details-${match.id}`}
                          className="p-4 bg-white flex justify-between"
                        >
                          <div>
                            <p className="text-sm text-gray-600 text-start">
                              <b className="mr-1">{t(translations.status)}: </b>
                              {t(translations.matchStatus[match.status])}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 text-start">
                              <b className="mr-1">{t(translations.winner)}: </b>
                              {match.winner
                                ? match.players[match.winner - 1].name
                                : '----'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 text-start">
                              <b className="mr-1">
                                {t(translations.totalRound)}:
                              </b>
                              {match.games?.length || 0}
                            </p>
                          </div>
                          <Button
                            className="mt-4"
                            onClick={() => navigator(`/match/${match.id}`)}
                          >
                            {t(translations.actions.view)}
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                  {!completedMatches.length ? (
                    <p className="text-gray-600 mt-4">
                      {t(translations.notify.noCompletedMatches)}
                    </p>
                  ) : null}
                </ul>
              </TabsContent>
            </Tabs>
          </section>
        </div>
        <section
          className="mt-12 bg-white rounded-lg shadow-lg p-6 "
          aria-labelledby="structure-title"
        >
          <div className="flex items-center justify-between">
            <h2
              id="structure-title"
              className="text-2xl font-semibold mb-4 flex items-center"
            >
              <FaUsers className="mr-2 text-primary" />{' '}
              {t(translations.tournamentStructure)}
            </h2>
            {userInfo?.email === tournament?.organizer?.id ? (
              <FaRegEdit
                className="text-xl text-primary mb-4"
                onClick={() => navigator(`/tournament/${id}/edit`)}
              />
            ) : null}
          </div>
          <div
            style={{
              height: window.innerHeight - 200,
            }}
          >
            {tournament?.format === 'single' ? (
              <SingleElimination rounds={(rounds || []) as any} />
            ) : null}
            {tournament?.format === 'double' ? (
              <DoubleElimination rounds={(rounds || []) as any} />
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
};

export default TournamentDetails;
