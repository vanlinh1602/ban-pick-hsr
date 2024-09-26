import _ from 'lodash';
import { Grid2X2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  selectCharacters,
  selectFilterCharacter,
} from '@/features/catalogs/store/selectors';
import type { Character } from '@/features/catalogs/types';
import { socket } from '@/services/socket';

import { useMatchSlice } from '../../store';
import { selectMatchData } from '../../store/selectors';

type Filter = {
  path?: string;
  combatType?: string;
  name?: string;
};

type Props = {
  id: string;
};

const BanPick = ({ id }: Props) => {
  const location = useLocation();
  const { state } = location;

  const dispatch = useDispatch();
  const { actions } = useMatchSlice();

  const matchData = useSelector((state: any) => selectMatchData(state, id));
  const characters = useSelector(selectCharacters);
  const filterCharacter = useSelector(selectFilterCharacter);

  const { matchSetup } = matchData || {};
  const [player, setPlayer] = useState<number>();
  const [filter, setFilter] = useState<Filter>();

  const [availableCharacters, setAvailableCharacters] = useState<Character[]>(
    Object.values(characters),
  );
  const [selectCharacter, setSelectCharacter] = useState<Character>();

  const { turn, activeTurn, playerData, selectedCharacters } = useMemo(() => {
    const data: {
      turn: number;
      activeTurn: {
        player: number;
        type: 'ban' | 'pick';
        character?: string;
        key: string;
      };
      playerData: CustomObject<{
        bans: string[];
        picks: string[];
      }>;
      selectedCharacters: string[];
    } = {
      turn: 0,
      activeTurn: { player: 0, type: 'ban', character: '', key: '' },
      playerData: {
        player1: { bans: [], picks: [] },
        player2: { bans: [], picks: [] },
      },
      selectedCharacters: [],
    };
    matchData.matchSetup?.banPickStatus.every((status, index) => {
      if (!status.character) {
        data.turn = index;
        data.activeTurn = {
          ...status,
          key: `${status.type}-${index}`,
        };
        return false;
      }
      if (status.type === 'ban') {
        data.playerData[`player${status.player}`].bans.push(status.character);
      } else {
        data.playerData[`player${status.player}`].picks.push(status.character);
      }
      data.selectedCharacters.push(status.character);
      return true;
    });

    return data;
  }, [matchData.matchSetup?.banPickStatus]);

  useEffect(() => {
    const { securityId } = state || {};
    if (securityId) {
      const findedPlayer = matchData.players?.findIndex((p) => {
        return p.id === securityId;
      });
      if (findedPlayer !== -1) {
        setPlayer(findedPlayer + 1);
      }
    }
  }, [matchData]);

  // Filter characters based on selected filters
  useEffect(() => {
    const filteredCharacters = Object.values(characters).filter((char) => {
      if (selectedCharacters.find((selected) => selected === char.id))
        return false;
      if (
        filter?.path &&
        filter.path !== 'all' &&
        !char.path.some(({ id }) => id === filter.path)
      )
        return false;
      if (
        filter?.combatType &&
        filter.combatType !== 'all' &&
        !char.combatType.some(({ id }) => id === filter.combatType)
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
  }, [filter, selectedCharacters]);

  const handleConfirm = () => {
    if (!selectCharacter) return;
    const banPickStatus = _.cloneDeep(matchSetup?.banPickStatus) || [];
    _.set(banPickStatus, [turn, 'character'], selectCharacter.id);

    dispatch(
      actions.modifyMatch({
        id,
        patch: ['matchSetup', 'banPickStatus'],
        data: banPickStatus,
      }),
    );
    const matchUpdate = _.cloneDeep(matchData);
    _.set(matchUpdate, ['matchSetup', 'banPickStatus'], banPickStatus);
    socket.emit('syncMatch', { match: matchUpdate, room: id });
    setSelectCharacter(undefined);
  };

  const handleStartGame = () => {
    const match = _.cloneDeep(matchData);
    match.status = 'playing';
    socket.emit('syncMatch', { match, room: id });
    dispatch(actions.updateMatch(match));
  };

  const renderCharacterGrid = () => {
    return availableCharacters.map((character) => (
      <button
        key={character.id}
        className={`p-2 rounded-lg transition-all duration-300 ${
          selectCharacter?.id === character.id
            ? 'ring-4 ring-blue-500'
            : 'hover:ring-2 hover:ring-gray-300'
        } flex flex-col items-center w-full h-full`}
        disabled={player !== activeTurn.player}
        onClick={() => {
          setSelectCharacter(character);
          socket.emit('syncUserAction', {
            room: id,
            action: 'banPick',
            data: {
              character: character.id,
              player: player,
              type: activeTurn.type,
              key: activeTurn.key,
            },
          });
        }}
      >
        <img
          src={character.icon}
          alt={character.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="mt-1 text-sm max-l">{character.name}</div>
      </button>
    ));
  };

  const renderUserSection = (player: number) => {
    const playerInfo = matchData.players?.[player - 1];
    const playerMatchData = playerData[`player${player}`];
    return (
      <div
        className={`flex flex-col items-center w-40 ${
          player === 1 ? 'order-first' : 'order-last'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center ${
            activeTurn.player === player ? 'ring-4 ring-yellow-400' : ''
          }`}
        >
          <FaUser className="text-4xl text-gray-600" />
        </div>
        <span className="mt-2 p-1 text-center">{playerInfo.name}</span>
        <div className="mt-4">
          <h3 className="font-bold">Bans:</h3>
          <div className="flex space-x-2 mt-1">
            {playerMatchData.bans.map((ban) => {
              const char = characters[ban];
              return (
                <img
                  key={char!.id}
                  src={char!.icon}
                  alt={char!.name}
                  className="w-10 h-10 rounded-full"
                />
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Picks:</h3>
          <div className="flex space-x-2 mt-1">
            {playerMatchData.picks.map((pick) => {
              const char = characters[pick];
              return (
                <img
                  key={char!.id}
                  src={char!.icon}
                  alt={char!.name}
                  className="w-10 h-10 rounded-full"
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-8">
      <div
        className="max-w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        style={player ? { height: 'calc(100vh - 140px)' } : undefined}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {activeTurn.player ? (
              <>
                {matchData.players?.[activeTurn.player - 1]?.name} (
                {activeTurn.type.toUpperCase()} Phase)
              </>
            ) : (
              'Ban Pick phase is over'
            )}
          </h2>
          <div className="flex justify-between items-start">
            {renderUserSection(1)}
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
                      {filterCharacter.character_paths.values.map((path) => (
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
                      {filterCharacter.character_combat_type.values.map(
                        (path) => (
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
                        ),
                      )}
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
              {player && (
                <div className="mt-1 flex justify-center space-x-4">
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300 ${
                      !selectCharacter ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!selectCharacter || player !== activeTurn.player}
                  >
                    <FaCheck className="inline-block mr-2" /> Confirm
                  </button>
                  {!activeTurn.player && (
                    <button
                      onClick={handleStartGame}
                      className={
                        'px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-800 transition-colors duration-300 '
                      }
                    >
                      Start Game
                    </button>
                  )}
                </div>
              )}
            </div>
            {renderUserSection(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanPick;
