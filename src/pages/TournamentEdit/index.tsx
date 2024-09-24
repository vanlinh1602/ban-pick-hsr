import { motion } from 'framer-motion';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { selectMatchOfTournament } from '@/features/match/store/selectors';
import { Match } from '@/features/match/types';
import { PLayersOrder } from '@/features/tournament/components';
import { useTournamentSlice } from '@/features/tournament/store';
import {
  selectTournamentData,
  selectTournamentHandling,
} from '@/features/tournament/store/selectors';
import { Player } from '@/features/tournament/type';
import { generateBracket } from '@/lib/bracket';

const TournamentEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useTournamentSlice();
  const [bracketType, setBracketType] = useState('single');
  const [error, setError] = useState('');
  const [rounds, setRounds] = useState<Match[][]>([]);
  const [showPlayerOrder, setShowPlayerOrder] = useState(false);
  const handling = useSelector(selectTournamentHandling);
  const tournament = useSelector((state: any) =>
    selectTournamentData(state, id!),
  );
  const tournamentMatchs = useSelector((state: any) =>
    selectMatchOfTournament(state, id!),
  );

  const updateMatchResult = (
    roundIndex: number,
    matchIndex: number,
    winner: number,
  ) => {
    const newRounds = [...rounds];
    newRounds[roundIndex][matchIndex].winner = winner;
    if (roundIndex + 1 < newRounds.length) {
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const isFirstTeam = matchIndex % 2 === 0;
      const playerWinner =
        newRounds[roundIndex][matchIndex].players?.[winner - 1];
      if (isFirstTeam) {
        _.set(
          newRounds,
          `${roundIndex + 1}.${nextMatchIndex}.players.0`,
          playerWinner,
        );
      } else {
        _.set(
          newRounds,
          `${roundIndex + 1}.${nextMatchIndex}.players.1`,
          playerWinner,
        );
      }
    }
    setRounds(newRounds);
  };

  const generate = () => {
    if (tournament?.players.length < 2) {
      setError('At least 2 teams required');
      return;
    }
    const newRounds = generateBracket('single', tournament?.players);
    setRounds(newRounds);
  };

  useEffect(() => {
    if (tournament?.rounds) {
      const rawRounds = tournament.rounds.map((r) => {
        return r.matches.map((m) => {
          return tournamentMatchs[m];
        });
      });
      setRounds(rawRounds);
    }
  }, [tournament]);

  const updatePlayersOrders = (players: Player[]) => {
    dispatch(
      actions.modifyTournament({
        path: [id!, 'players'],
        data: players,
      }),
    );
    setShowPlayerOrder(false);
  };

  const saveBracket = () => {
    if (rounds.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'No bracket to save',
      });
      return;
    }
    dispatch(
      actions.saveBracket({
        id: id!,
        rounds,
      }),
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl ">
      {handling ? <Waiting /> : null}
      {showPlayerOrder && (
        <PLayersOrder
          onClose={() => setShowPlayerOrder(false)}
          data={tournament?.players}
          onConfirm={updatePlayersOrders}
        />
      )}
      <h1 className="text-3xl font-bold mb-6">Tournament Bracket Manager</h1>
      <div className="mb-8 w-full bg-white p-5 rounded-lg shadow-md">
        <h2
          className="text-2xl font-semibold mb-4"
          onClick={() => setShowPlayerOrder(true)}
        >
          Bracket Setup
        </h2>
        <div className="md:flex flex-wrap gap-4 mb-4 grid grid-cols-1 ">
          <select
            value={bracketType}
            onChange={(e) => setBracketType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="single">Single Elimination</option>
            <option value="double">Double Elimination</option>
            <option value="round-robin">Round Robin</option>
          </select>
          <button
            onClick={generate}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Generate Bracket
          </button>
          <button
            onClick={() => setShowPlayerOrder(true)}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            View Players Order
          </button>
          <button
            onClick={saveBracket}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
      <div className="mb-8 bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-5">Bracket Visualization</h2>
        <div className="flex overflow-x-auto space-x-8 p-4">
          {rounds?.map((round, roundIndex) => (
            <div key={roundIndex} className="flex flex-col space-y-4">
              <h3 className="text-xl font-medium">Round {roundIndex + 1}</h3>
              {round.map((match, matchIndex) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded shadow-md w-64"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`font-semibold ${
                        match.winner === 1
                          ? 'text-green-500'
                          : match.winner === 2
                            ? 'text-red-500'
                            : ''
                      }`}
                    >
                      1 - {match.players[0]?.name || 'TBD'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-semibold ${
                        match.winner === 2
                          ? 'text-green-500'
                          : match.winner === 1
                            ? 'text-red-500'
                            : ''
                      }`}
                    >
                      2 - {match.players[1]?.name || 'TBD'}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={() =>
                        updateMatchResult(roundIndex, matchIndex, 1)
                      }
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                      disabled={!match.players.length}
                    >
                      <FaTrophy className="inline mr-1" /> Winner: 1
                    </button>
                    <button
                      onClick={() =>
                        updateMatchResult(roundIndex, matchIndex, 2)
                      }
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                      disabled={!match.players.length}
                    >
                      <FaTrophy className="inline mr-1" /> Winner: 2
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Final Results</h2>
        {rounds.length > 0 && rounds[rounds.length - 1][0].winner && (
          <div className="bg-yellow-100 p-4 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Tournament Winner</h3>
            <p className="text-2xl text-yellow-600">
              <FaTrophy className="inline mr-2" />
              {rounds[rounds.length - 1][0].winner.name}
            </p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default TournamentEdit;
