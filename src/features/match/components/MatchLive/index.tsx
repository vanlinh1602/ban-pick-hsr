import React, { useEffect, useState } from 'react';
import { FaExpand, FaPlay, FaVolumeUp } from 'react-icons/fa';

const MatchLive = () => {
  const [isLive, setIsLive] = useState(true);
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const matchDetails = {
    tournament: 'Summer Championship 2023',
    team1: 'Dragon Warriors',
    team2: 'Phoenix Risers',
    date: '2023-07-15',
  };

  const picks = {
    team1: ['Hero1', 'Hero2', 'Hero3', 'Hero4', 'Hero5'],
    team2: ['Champion1', 'Champion2', 'Champion3', 'Champion4', 'Champion5'],
  };

  const bans = {
    team1: ['Ban1', 'Ban2', 'Ban3'],
    team2: ['Ban4', 'Ban5', 'Ban6'],
  };

  const lineups = {
    team1: [
      { name: 'Player1', role: 'Top' },
      { name: 'Player2', role: 'Jungle' },
      { name: 'Player3', role: 'Mid' },
      { name: 'Player4', role: 'ADC' },
      { name: 'Player5', role: 'Support' },
    ],
    team2: [
      { name: 'Player6', role: 'Top' },
      { name: 'Player7', role: 'Jungle' },
      { name: 'Player8', role: 'Mid' },
      { name: 'Player9', role: 'ADC' },
      { name: 'Player10', role: 'Support' },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Column - Video Player */}
      <div className="md:w-2/3 p-4">
        <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://example.com/live-stream.mp4"
            controls
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Play/Pause"
            >
              <FaPlay className="text-gray-800" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Volume"
            >
              <FaVolumeUp className="text-gray-800" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Fullscreen"
            >
              <FaExpand className="text-gray-800" />
            </button>
          </div>
          {isLive && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
              LIVE
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Match Information */}
      <div className="md:w-1/3 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            {matchDetails.tournament}
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                {matchDetails.team1}
              </h3>
              <p className="text-3xl font-bold">{score.team1}</p>
            </div>
            <div className="text-2xl font-bold text-gray-600">vs</div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-600">
                {matchDetails.team2}
              </h3>
              <p className="text-3xl font-bold">{score.team2}</p>
            </div>
          </div>
          <p className="text-center text-gray-600">
            {matchDetails.date} - {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Picks & Bans
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">
                {matchDetails.team1} Picks
              </h4>
              <ul className="list-disc list-inside">
                {picks.team1.map((pick, index) => (
                  <li key={index} className="text-gray-700">
                    {pick}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">
                {matchDetails.team2} Picks
              </h4>
              <ul className="list-disc list-inside">
                {picks.team2.map((pick, index) => (
                  <li key={index} className="text-gray-700">
                    {pick}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">
                {matchDetails.team1} Bans
              </h4>
              <ul className="list-disc list-inside">
                {bans.team1.map((ban, index) => (
                  <li key={index} className="text-gray-700">
                    {ban}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">
                {matchDetails.team2} Bans
              </h4>
              <ul className="list-disc list-inside">
                {bans.team2.map((ban, index) => (
                  <li key={index} className="text-gray-700">
                    {ban}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Team Lineups
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">
                {matchDetails.team1}
              </h4>
              <ul className="space-y-2">
                {lineups.team1.map((player, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700">{player.name}</span>
                    <span className="text-gray-500">{player.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">
                {matchDetails.team2}
              </h4>
              <ul className="space-y-2">
                {lineups.team2.map((player, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700">{player.name}</span>
                    <span className="text-gray-500">{player.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchLive;
