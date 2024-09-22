import { useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaMedal,
  FaTrophy,
} from 'react-icons/fa';

const BracketDisplay = () => {
  const [currentRound, setCurrentRound] = useState(1);

  const matches = [
    {
      id: 1,
      round: 1,
      bracket: 'winners',
      team1: 'Team A',
      team2: 'Team B',
      score1: 3,
      score2: 1,
    },
    {
      id: 2,
      round: 1,
      bracket: 'winners',
      team1: 'Team C',
      team2: 'Team D',
      score1: 2,
      score2: 2,
    },
    {
      id: 3,
      round: 2,
      bracket: 'winners',
      team1: 'Team A',
      team2: 'Team C',
      score1: 4,
      score2: 0,
    },
    {
      id: 4,
      round: 1,
      bracket: 'losers',
      team1: 'Team B',
      team2: 'Team D',
      score1: 1,
      score2: 3,
    },
    {
      id: 5,
      round: 2,
      bracket: 'losers',
      team1: 'Team D',
      team2: 'Team C',
      score1: 2,
      score2: 1,
    },
    {
      id: 6,
      round: 3,
      bracket: 'final',
      team1: 'Team A',
      team2: 'Team D',
      score1: 5,
      score2: 2,
    },
  ];

  const maxRounds = Math.max(...matches.map((m) => m.round));

  const nextRound = () => {
    setCurrentRound((prev) => Math.min(prev + 1, maxRounds));
  };

  const prevRound = () => {
    setCurrentRound((prev) => Math.max(prev - 1, 1));
  };

  const MatchCard = ({ match }: any) => (
    <div
      className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg"
      aria-label={`Match between ${match.team1} and ${match.team2} in round ${match.round} of ${match.bracket} bracket`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-600">
          {match.bracket.toUpperCase()} BRACKET
        </span>
        <span className="text-sm font-semibold text-gray-600">
          Round {match.round}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{match.team1}</span>
        <span className="font-bold text-xl text-blue-600">{match.score1}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="font-bold text-lg">{match.team2}</span>
        <span className="font-bold text-xl text-blue-600">{match.score2}</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevRound}
          disabled={currentRound === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <FaChevronLeft className="mr-2" /> Previous Round
        </button>
        <span className="text-xl font-semibold">Round {currentRound}</span>
        <button
          onClick={nextRound}
          disabled={currentRound === maxRounds}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next Round <FaChevronRight className="ml-2" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaTrophy className="text-yellow-400 mr-2" /> Winners Bracket
          </h2>
          {matches
            .filter((m) => m.round === currentRound && m.bracket === 'winners')
            .map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
        </div>
        <div className="col-span-1">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaMedal className="text-gray-400 mr-2" /> Losers Bracket
          </h2>
          {matches
            .filter((m) => m.round === currentRound && m.bracket === 'losers')
            .map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
        </div>
        <div className="col-span-1">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaTrophy className="text-gold-400 mr-2" /> Final
          </h2>
          {matches
            .filter((m) => m.round === currentRound && m.bracket === 'final')
            .map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BracketDisplay;
