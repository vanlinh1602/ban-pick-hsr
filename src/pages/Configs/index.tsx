import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { selectCharacters } from '@/features/catalogs/store/selectors';
import { EditPoints, PointsCard } from '@/features/configs/components';

type Character = {
  id: string;
  name: string;
  points: number;
  avatar: string;
};

const CharacterPointsAdjuster = () => {
  const allCharacters = useSelector(selectCharacters);

  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Warrior',
      points: 100,
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '2',
      name: 'Mage',
      points: 80,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '3',
      name: 'Rogue',
      points: 90,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '4',
      name: 'Warrior',
      points: 100,
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '5',
      name: 'Mage',
      points: 80,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '6',
      name: 'Rogue',
      points: 90,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },

    {
      id: '7',
      name: 'Warrior',
      points: 100,
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '8',
      name: 'Mage',
      points: 80,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '9',
      name: 'Rogue',
      points: 90,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },

    {
      id: '10',
      name: 'Warrior',
      points: 100,
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '11',
      name: 'Mage',
      points: 80,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: '12',
      name: 'Rogue',
      points: 90,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [editPoints, setEditPoints] = useState<string>();

  useEffect(() => {
    setCharacters(
      allCharacters.map((char) => ({
        points: 0,
        id: char.entry_page_id,
        name: char.name,
        avatar: char.icon_url,
      })),
    );
  }, [allCharacters]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (criteria: any) => {
    setSortCriteria(criteria);
  };

  const handleSelect = (id: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(id)
        ? prev.filter((charId) => charId !== id)
        : [...prev, id],
    );
  };

  const adjustPoints = (id: string, points: number) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, points: points } : char)),
    );
    setEditPoints(undefined);
  };

  const filteredAndSortedCharacters = characters
    .filter((char) =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortCriteria === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortCriteria === 'points') {
        return b.points - a.points;
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      {editPoints ? (
        <EditPoints
          onConfirm={(points) => adjustPoints(editPoints, points)}
          onClose={() => setEditPoints(undefined)}
          points={characters.find((char) => char.id === editPoints)?.points}
        />
      ) : null}
      <h1 className="text-3xl font-bold mb-6">Character Points Adjuster</h1>
      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 pl-8 border rounded-md"
            aria-label="Search characters"
          />
          <FaSearch className="absolute left-2 top-3 text-gray-400" />
        </div>
        <select
          onChange={(e) => handleSort(e.target.value)}
          className="p-2 border rounded-md"
          aria-label="Sort characters"
        >
          <option value="name">Sort by Name</option>
          <option value="points">Sort by Points</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredAndSortedCharacters.map((character) => (
          <PointsCard
            key={character.id}
            item={character}
            onClick={(id, action) => {
              if (action === 'select') {
                handleSelect(id);
              } else {
                setEditPoints(id);
              }
            }}
            selected={selectedCharacters.includes(character.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterPointsAdjuster;
