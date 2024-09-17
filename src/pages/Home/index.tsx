import { useEffect, useState } from 'react';
import { FaCheck, FaUndo, FaUser } from 'react-icons/fa';

const characters = [
  {
    id: 1,
    name: 'Character 1',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Character 2',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Character 3',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Character 4',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Character 5',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 6,
    name: 'Character 6',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

const BanPickUI = () => {
  const [phase, setPhase] = useState('ban'); // 'ban' or 'pick'\
  const [activeUser, setActiveUser] = useState('left');
  const [leftUser, setLeftUser] = useState({
    name: 'Player 1',
    bans: [],
    picks: [],
  });
  const [rightUser, setRightUser] = useState({
    name: 'Player 2',
    bans: [],
    picks: [],
  });
  const [availableCharacters, setAvailableCharacters] = useState(characters);
  const [timer, setTimer] = useState(30);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          handlePhaseChange();
          return 30;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const handlePhaseChange = () => {
    if (
      phase === 'ban' &&
      leftUser.bans.length === 2 &&
      rightUser.bans.length === 2
    ) {
      setPhase('pick');
    } else if (
      phase === 'pick' &&
      leftUser.picks.length === 2 &&
      rightUser.picks.length === 2
    ) {
      // End game or show results
      alert('Game Over!');
    } else {
      setActiveUser(activeUser === 'left' ? 'right' : 'left');
    }
  };

  const handleCharacterSelect = (character: any) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (!selectedCharacter) return;

    const updatedAvailableCharacters = availableCharacters.filter(
      (char) => char.id !== (selectedCharacter as any).id,
    );

    if (phase === 'ban') {
      if (activeUser === 'left') {
        setLeftUser({
          ...leftUser,
          bans: [...leftUser.bans, selectedCharacter],
        });
      } else {
        setRightUser({
          ...rightUser,
          bans: [...rightUser.bans, selectedCharacter],
        });
      }
    } else if (activeUser === 'left') {
      setLeftUser({
        ...leftUser,
        picks: [...leftUser.picks, selectedCharacter],
      });
    } else {
      setRightUser({
        ...rightUser,
        picks: [...rightUser.picks, selectedCharacter],
      });
    }

    setAvailableCharacters(updatedAvailableCharacters);
    setSelectedCharacter(null);
    handlePhaseChange();
    setTimer(30);
  };

  const handleUndo = () => {
    setSelectedCharacter(null);
  };

  const renderCharacterGrid = () => {
    return availableCharacters.map((character) => (
      <button
        key={character.id}
        className={`p-2 rounded-lg transition-all duration-300 ${
          (selectedCharacter as any)?.id === character.id
            ? 'ring-4 ring-blue-500'
            : 'hover:ring-2 hover:ring-gray-300'
        }`}
        onClick={() => handleCharacterSelect(character)}
      >
        <img
          src={character.image}
          alt={character.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <p className="mt-1 text-sm">{character.name}</p>
      </button>
    ));
  };

  const renderUserSection = (user: any, side: any) => {
    return (
      <div
        className={`flex flex-col items-center ${
          side === 'left' ? 'order-first' : 'order-last'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center ${
            activeUser === side ? 'ring-4 ring-yellow-400' : ''
          }`}
        >
          <FaUser className="text-4xl text-gray-600" />
        </div>
        <input
          type="text"
          value={user.name}
          onChange={(e) =>
            side === 'left'
              ? setLeftUser({ ...leftUser, name: e.target.value })
              : setRightUser({ ...rightUser, name: e.target.value })
          }
          className="mt-2 p-1 border rounded text-center"
        />
        <div className="mt-4">
          <h3 className="font-bold">Bans:</h3>
          <div className="flex space-x-2 mt-1">
            {user.bans.map((ban: any) => (
              <img
                key={ban.id}
                src={ban.image}
                alt={ban.name}
                className="w-10 h-10 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Picks:</h3>
          <div className="flex space-x-2 mt-1">
            {user.picks.map((pick: any) => (
              <img
                key={pick.id}
                src={pick.image}
                alt={pick.name}
                className="w-10 h-10 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Character {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
          </h1>
          <div className="flex justify-between items-start">
            {renderUserSection(leftUser, 'left')}
            <div className="flex-1 mx-8">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">
                  {activeUser === 'left' ? leftUser.name : rightUser.name}
                  &rsquo;s Turn
                </h2>
                <p className="text-2xl font-bold">{timer}s</p>
              </div>
              <div className="grid grid-cols-3 gap-4 justify-items-center">
                {renderCharacterGrid()}
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={handleUndo}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
                >
                  <FaUndo className="inline-block mr-2" /> Undo
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300 ${
                    !selectedCharacter ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectedCharacter}
                >
                  <FaCheck className="inline-block mr-2" /> Confirm
                </button>
              </div>
            </div>
            {renderUserSection(rightUser, 'right')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanPickUI;
