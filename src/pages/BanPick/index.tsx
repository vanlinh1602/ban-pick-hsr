import { Grid2X2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaUser } from 'react-icons/fa';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import characters from '@/data/character.json';
import combatTypes from '@/data/combatType.json';
import paths from '@/data/path.json';

import { Character } from './type';

type UserInfo = {
  name: string;
  bans: Character[];
  picks: Character[];
};

type Filter = {
  path?: string;
  combatType?: string;
  name?: string;
};

type Props = {
  matchInfo: {
    turn: { player: number; type: string }[];
    firstPick: string;
    goFirst: string;
  };
};

const BanPick = ({ matchInfo }: Props) => {
  const [activeUser, setActiveUser] = useState<string>(
    matchInfo.firstPick === 'player1' ? 'left' : 'right',
  );
  const [turn, setTurn] = useState<number>(0);
  const [filter, setFilter] = useState<Filter>();
  const [leftUser, setLeftUser] = useState<UserInfo>({
    name: 'Player 1',
    bans: [],
    picks: [],
  });
  const [rightUser, setRightUser] = useState<UserInfo>({
    name: 'Player 2',
    bans: [],
    picks: [],
  });
  const [availableCharacters, setAvailableCharacters] =
    useState<Character[]>(characters);
  const [selectCharacter, setSelectCharacter] = useState<Character>();

  const selectedCharacters = useMemo(() => {
    return leftUser.bans.concat(
      rightUser.bans,
      leftUser.picks,
      rightUser.picks,
    );
  }, [leftUser, rightUser]);

  // Filter characters based on selected filters
  useEffect(() => {
    const filteredCharacters = characters.filter((char) => {
      if (selectedCharacters.find((selected) => selected === char))
        return false;
      if (
        filter?.path &&
        filter.path !== 'all' &&
        !char.filter_values.character_paths.value_types.find(
          ({ id }) => id === filter.path,
        )
      )
        return false;
      if (
        filter?.combatType &&
        filter.combatType !== 'all' &&
        !char.filter_values.character_combat_type.value_types.find(
          ({ id }) => id === filter.combatType,
        )
      )
        return false;
      if (
        filter?.name &&
        !char.name.toLowerCase().includes(filter.name.toLowerCase())
      )
        return false;
      return true;
    });
    setAvailableCharacters(filteredCharacters);
  }, [filter]);

  const handleConfirm = () => {
    if (!selectCharacter) return;

    const updatedAvailableCharacters = availableCharacters.filter(
      (char) => char.entry_page_id !== selectCharacter.entry_page_id,
    );
    const activeTurn = matchInfo.turn[turn];

    if (activeTurn?.type === 'ban') {
      if (activeUser === 'left') {
        setLeftUser({
          ...leftUser,
          bans: [...leftUser.bans, selectCharacter],
        });
      } else {
        setRightUser({
          ...rightUser,
          bans: [...rightUser.bans, selectCharacter],
        });
      }
    } else if (activeUser === 'left') {
      setLeftUser({
        ...leftUser,
        picks: [...leftUser.picks, selectCharacter],
      });
    } else {
      setRightUser({
        ...rightUser,
        picks: [...rightUser.picks, selectCharacter],
      });
    }

    setAvailableCharacters(updatedAvailableCharacters);
    setSelectCharacter(undefined);
    setActiveUser((prev) => {
      const nextTurn = matchInfo.turn[turn + 1];
      if (!nextTurn) return prev;
      return nextTurn.player === 1 ? 'left' : 'right';
    });
    setTurn((pre) => pre + 1);
  };

  const renderCharacterGrid = () => {
    return availableCharacters.map((character) => (
      <button
        key={character.entry_page_id}
        className={`p-2 rounded-lg transition-all duration-300 ${
          selectCharacter?.entry_page_id === character.entry_page_id
            ? 'ring-4 ring-blue-500'
            : 'hover:ring-2 hover:ring-gray-300'
        } flex flex-col items-center w-full h-full`}
        disabled={!matchInfo.turn[turn]}
        onClick={() => setSelectCharacter(character)}
      >
        <img
          src={character.icon_url}
          alt={character.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="mt-1 text-sm max-l">{character.name}</div>
      </button>
    ));
  };

  const renderUserSection = (user: UserInfo, side: string) => {
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
            {user.bans.map((ban: Character) => (
              <img
                key={ban.entry_page_id}
                src={ban.icon_url}
                alt={ban.name}
                className="w-10 h-10 rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Picks:</h3>
          <div className="flex space-x-2 mt-1">
            {user.picks.map((pick) => (
              <img
                key={pick.entry_page_id}
                src={pick.icon_url}
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
    <div className="bg-gray-100 p-8">
      <div
        className="max-w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {matchInfo.turn[turn] ? (
              <>
                {activeUser === 'left' ? leftUser.name : rightUser.name} (
                {matchInfo.turn[turn]?.type.toUpperCase()} Phase)
              </>
            ) : (
              'Ban Pick phase is over'
            )}
          </h2>
          <div className="flex justify-between items-start">
            {renderUserSection(leftUser, 'left')}
            <div className="flex-1 mx-8 ">
              <div className="flex mb-4 justify-around">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-bold">Path</span>
                  <Select
                    defaultValue="all"
                    onValueChange={(value) =>
                      setFilter((pre) => ({ ...pre, path: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex space-x-2 mt-1 ">
                          <Grid2X2 className="w-5 h-5 rounded-full " />
                          <div>All</div>
                        </div>
                      </SelectItem>
                      {paths.map((path) => (
                        <SelectItem key={path.id} value={path.id}>
                          <div className="flex space-x-2 mt-1 ">
                            <img
                              key={path.id}
                              src={path.icon}
                              alt={path.enum_string}
                              className="w-5 h-5 rounded-full bg-black"
                            />
                            <div>{path.value}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-bold">Combat Type</span>
                  <Select
                    defaultValue="all"
                    onValueChange={(value) =>
                      setFilter((pre) => ({ ...pre, combatType: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex space-x-2 mt-1 ">
                          <Grid2X2 className="w-5 h-5 rounded-full " />
                          <div>All</div>
                        </div>
                      </SelectItem>
                      {combatTypes.map((path) => (
                        <SelectItem key={path.id} value={path.id}>
                          <div className="flex space-x-2 mt-1 ">
                            <img
                              key={path.id}
                              src={path.icon}
                              alt={path.enum_string}
                              className="w-5 h-5 rounded-full bg-black"
                            />
                            <div>{path.value}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-bold">Search</span>
                  <Input
                    placeholder={'Name'}
                    onChange={(e) =>
                      setFilter((pre) => ({ ...pre, name: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div
                className="grid grid-cols-6 gap-5 justify-items-center overflow-y-scroll p-5"
                style={{ height: 'calc(100vh - 340px)' }}
              >
                {renderCharacterGrid()}
              </div>
              <div className="mt-1 flex justify-center space-x-4">
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300 ${
                    !selectCharacter ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectCharacter}
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

export default BanPick;
