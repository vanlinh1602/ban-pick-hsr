import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
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
import { EditTournament } from '@/features/home/components';
import { useMatchSlice } from '@/features/match/store';
import { selectMatchOfTournament } from '@/features/match/store/selectors';
import { Match } from '@/features/match/types';
import { BracketDisplay, ViewPlayers } from '@/features/tournament/components';
import { useTournamentSlice } from '@/features/tournament/store';
import { selectTournamentData } from '@/features/tournament/store/selectors';
type TournamentData = {
  players: {
    name: string;
    ranking: number;
    points: number;
    matchesWon: number;
  }[];
  upcomingMatches: Match[];
  completedMatches: Match[];
  rounds: {
    round: string;
    matches: Match[];
  }[];
};

const TournamentDetails = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions: matchActions } = useMatchSlice();
  const { actions: tournamentActions } = useTournamentSlice();
  const tournament = useSelector((state: any) =>
    selectTournamentData(state, id!),
  );
  const tournamentMatches = useSelector((state: any) =>
    selectMatchOfTournament(state, id!),
  );

  const [expandedMatch, setExpandedMatch] = useState<string>();
  const [sortCriteria, setSortCriteria] = useState('ranking');
  const [isEditing, setIsEditing] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    dispatch(matchActions.getMatches({ tournament: id! }));
    if (!tournament) {
      dispatch(tournamentActions.getTournament(id!));
    }
  }, []);

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
        rounds: {
          round: string;
          matches: Match[];
        }[];
      } = {
        players: {},
        upcomingMatches: [],
        completedMatches: [],
        rounds: [],
      };

      const now = Date.now();

      tournament?.rounds?.forEach((round) => {
        const matchesRound: Match[] = [];
        round.matches.forEach((matchId) => {
          const match = tournamentMatches[matchId] || {};
          matchesRound.push(match);
          const { players: matchPlayers, winner, games, date } = match;
          const gameResults = games?.reduce(
            (acc, game) => {
              const { player, points } = game;
              acc[player - 1].points += points;
              if (winner === player) {
                acc[player - 1].matchesWon += 1;
              }
              return acc;
            },
            [
              { points: 0, matchesWon: 0 },
              { points: 0, matchesWon: 0 },
            ] as { points: number; matchesWon: number }[],
          );
          matchPlayers.forEach((player, index) => {
            if (!initialData.players[player.id]) {
              initialData.players[player.id] = {
                name: player.name,
                points: 0,
                matchesWon: 0,
              };
            }
            initialData.players[player.id].points +=
              gameResults?.[index]?.points || 0;
            initialData.players[player.id].matchesWon +=
              gameResults?.[index]?.matchesWon || 0;
          });
          if (date && date >= now) {
            initialData.upcomingMatches.push(match);
          } else {
            initialData.completedMatches.push(match);
          }
        });
        initialData.rounds.push({ round: round.round, matches: matchesRound });
      });

      return {
        players: Object.values(initialData.players)
          .sort((a, b) => a.matchesWon - b.matchesWon)
          .map((player, index) => ({ ...player, ranking: index + 1 })),
        upcomingMatches: initialData.upcomingMatches,
        completedMatches: initialData.completedMatches,
        rounds: initialData.rounds,
      };
    }, [tournament, tournamentMatches]);

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortCriteria === 'ranking') return a.ranking - b.ranking;
    if (sortCriteria === 'points') return b.points - a.points;
    if (sortCriteria === 'matchesWon') return b.matchesWon - a.matchesWon;
    return 0;
  });

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
        />
      )}
      {showPlayer && (
        <ViewPlayers tournamentId={id!} onClose={() => setShowPlayer(false)} />
      )}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-3 mb-8">
          <div></div>
          <h1 className="text-4xl font-bold  text-center">
            {tournament?.name}
          </h1>
          <div className="flex justify-end items-center">
            <FaRegEdit
              className="text-xl text-blue-400"
              onClick={() => setIsEditing(true)}
            />
          </div>
        </div>
        <section
          className="mb-10 bg-white rounded-lg shadow-lg p-6"
          aria-labelledby="structure-title"
        >
          <h2
            id="structure-title"
            className="text-lg font-semibold mb-4 flex items-center"
          >
            <FaAudioDescription className="mr-2 text-blue-500" />
            Decriptions:{' '}
            <span className="ml-2 font-normal">{tournament?.description}</span>
          </h2>
          <h2
            id="structure-title"
            className="text-lg font-semibold mb-4 flex items-center"
          >
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Ngày:{' '}
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
            <GoOrganization className="mr-2 text-blue-500" />
            Organizer:{' '}
            <span className="ml-2 font-normal">{tournament?.organizer}</span>
          </h2>
          <h2
            id="structure-title"
            className="text-lg font-semibold flex items-center"
          >
            <VscOrganization className="mr-2 text-blue-500" />
            Number of participants:{' '}
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
                <FaTrophy className="mr-2 text-yellow-500" /> Player Rankings
              </h2>
              <Button
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setShowPlayer(true)}
              >
                View Player
              </Button>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players"
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Search players"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                aria-label="Sort criteria"
              >
                <option value="ranking">Ranking</option>
                <option value="points">Points</option>
                <option value="matchesWon">Matches Won</option>
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
                      Rank: {index + 1}
                    </span>
                    <span className="text-sm text-gray-600">
                      Points: {player.points}
                    </span>
                    <span className="text-sm text-gray-600">
                      Wins: {player.matchesWon}
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
            {/* <h2
              id="matches-title"
              className="text-2xl font-semibold mb-4 flex items-center"
            >
              <FaClock className="mr-2 text-blue-500" /> Upcoming Matches
            </h2>
            <ul className="space-y-4 max-h-80 overflow-y-scroll no-scrollbar">
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
                      className="p-4 bg-white"
                    >
                      <p className="text-sm text-gray-600">Round: 1</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Additional match details and live updates can be
                        displayed here.
                      </p>
                    </div>
                  )}
                </li>
              ))}
              {!upcomingMatches.length ? (
                <p className="text-gray-600">No upcoming matches</p>
              ) : null}
            </ul> */}

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Match</TabsTrigger>
                <TabsTrigger value="password">Completed Match</TabsTrigger>
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
                          className="p-4 bg-white"
                        >
                          <p className="text-sm text-gray-600">Round: 1</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Additional match details and live updates can be
                            displayed here.
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                  {!upcomingMatches.length ? (
                    <p className="text-gray-600 mt-4">No upcoming matches</p>
                  ) : null}
                </ul>
              </TabsContent>
              <TabsContent value="password">
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
                          className="p-4 bg-white"
                        >
                          <p className="text-sm text-gray-600">Round: 1</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Additional match details and live updates can be
                            displayed here.
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                  {!completedMatches.length ? (
                    <p className="text-gray-600 mt-4">No completed matches</p>
                  ) : null}
                </ul>
              </TabsContent>
            </Tabs>
          </section>
        </div>
        <section
          className="mt-12 bg-white rounded-lg shadow-lg p-6"
          aria-labelledby="structure-title"
        >
          <div className="flex items-center justify-between">
            <h2
              id="structure-title"
              className="text-2xl font-semibold mb-4 flex items-center"
            >
              <FaUsers className="mr-2 text-green-500" /> Tournament Structure
            </h2>
            <FaRegEdit
              className="text-xl text-blue-400 mb-4"
              onClick={() => navigator(`/tournament/${id}/edit`)}
            />
          </div>
          <BracketDisplay />
        </section>
      </div>
    </>
  );
};

export default TournamentDetails;
