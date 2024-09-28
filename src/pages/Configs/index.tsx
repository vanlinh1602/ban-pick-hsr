import { cloneDeep, set } from 'lodash';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCatalogSlice } from '@/features/catalogs/store';
import {
  selectCharacters,
  selectConfigs,
  selectFilterCharacter,
  selectFilterLightCone,
  selectLightCones,
} from '@/features/catalogs/store/selectors';
import { Character, Configs, LightCone } from '@/features/catalogs/types';
import { EditPoints, PointsCard } from '@/features/configs/components';

type FilterField = {
  id: string;
  name: string;
  options: {
    id: string;
    value: string;
    icon?: string;
  }[];
};

const PointsAdjuster = () => {
  const dispatch = useDispatch();
  const { actions } = useCatalogSlice();
  const allCharacters = useSelector(selectCharacters);
  const allLinghtCones = useSelector(selectLightCones);
  const filterCharacter = useSelector(selectFilterCharacter);
  const filterLightCone = useSelector(selectFilterLightCone);
  const systemConfigs = useSelector(selectConfigs);

  const [activeMenu, setActiveMenu] = useState('characters');

  const [activeItems, setActiveItems] = useState<(Character | LightCone)[]>([]);
  const [filter, setFilter] = useState<CustomObject<string>>({});
  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [editPoints, setEditPoints] = useState<string>();
  const [updateConfigs, setUpdateConfigs] = useState<CustomObject<Configs>>({});

  useEffect(() => {
    const menuFilter: FilterField[] = [];
    if (activeMenu === 'characters') {
      menuFilter.push({
        id: 'paths',
        name: 'Paths',
        options: filterCharacter.character_paths.values.map((path) => ({
          id: path.id,
          value: path.value,
          icon: path.icon,
        })),
      });
      menuFilter.push({
        id: 'combatType',
        name: 'Combat Type',
        options: filterCharacter.character_combat_type.values.map((cb) => ({
          id: cb.id,
          value: cb.value,
          icon: cb.icon,
        })),
      });
      setActiveItems(Object.values(allCharacters));
    } else {
      menuFilter.push({
        id: 'paths',
        name: 'Paths',
        options: filterLightCone.equipment_paths.values.map((path) => ({
          id: path.id,
          value: path.value,
          icon: path.icon,
        })),
      });
      menuFilter.push({
        id: 'rarity',
        name: 'Rarity',
        options: filterLightCone.equipment_rarity.values.map((rarity) => ({
          id: rarity.id,
          value: rarity.value,
        })),
      });
      setActiveItems(Object.values(allLinghtCones));
    }
    setFilterFields(menuFilter);
    setFilter({});
  }, [activeMenu]);

  useEffect(() => {
    const items = activeMenu === 'characters' ? allCharacters : allLinghtCones;
    const { sort, name, ...rest } = filter;
    const filteredItems = Object.values(items).filter((item) => {
      if (name && !item.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      return Object.entries(rest).every(([key, value]) => {
        if (!value || value === 'all') return true;
        if (Array.isArray(item[key])) {
          return item[key].some((v) => v.id === value);
        }
        return item[key].id === value;
      });
    });

    if (sort === 'name') {
      filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'points') {
      filteredItems.sort((a, b) => b.points - a.points);
    }
    setActiveItems(filteredItems);
  }, [filter]);

  const handleSelect = (id: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(id)
        ? prev.filter((charId) => charId !== id)
        : [...prev, id],
    );
  };

  const adjustPoints = (ids: string[], points: number) => {
    const updated = cloneDeep(updateConfigs);
    ids.forEach((id) => {
      set(updated, [id, 'points'], points);
    });
    setUpdateConfigs(updated);
    setEditPoints(undefined);
  };

  return (
    <div className="container mx-auto p-4">
      {editPoints ? (
        <EditPoints
          onConfirm={(points) => {
            adjustPoints(
              editPoints === 'all' ? selectedCharacters : [editPoints],
              points,
            );
          }}
          onClose={() => setEditPoints(undefined)}
          points={
            updateConfigs[editPoints]?.points ||
            systemConfigs[editPoints]?.points
          }
        />
      ) : null}
      <h1 className="text-3xl font-bold mb-6">Points Adjuster</h1>
      <div className="mb-4 flex items-center space-x-4 justify-between">
        <div className="flex">
          <div className="text-start mr-3">
            <h1 className="text-gray-700 mb-1">Menu Items</h1>
            <Select value={activeMenu} onValueChange={(v) => setActiveMenu(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select active" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="characters">Characters</SelectItem>
                  <SelectItem value="lightCones">Light Cone</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {filterFields.map((field) => (
            <div key={field.id} className="text-start mr-3">
              <h1 className="text-gray-700 mb-1">{field.name}</h1>
              <Select
                value={filter[field.id]}
                onValueChange={(v) =>
                  setFilter((pre) => ({
                    ...pre,
                    [field.id]: v,
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Select ${field.name}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    {field.options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex">
                          {option.icon ? (
                            <img
                              key={`icon-${option.id}`}
                              src={option.icon}
                              alt={option.value}
                              className="w-5 h-5 rounded-full bg-gray-700 mr-1"
                            />
                          ) : null}
                          {option.value}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="text-start mr-3">
            <h1 className="text-gray-700 mb-1">Search</h1>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search characters..."
                onChange={({ target }) =>
                  setFilter((pre) => ({ ...pre, name: target.value }))
                }
                className="w-full p-2 pl-8 border rounded-md"
                aria-label="Search characters"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>
          </div>
          <div className="text-start mr-3">
            <h1 className="text-gray-700 mb-1">Sort</h1>
            <Select
              value={filter.sort}
              onValueChange={(v) =>
                setFilter((pre) => ({
                  ...pre,
                  sort: v,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sort field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            {selectedCharacters.length > 0 ? (
              <>
                <Button className="mr-3" onClick={() => setEditPoints('all')}>
                  Edit
                </Button>
                <Button
                  className="mr-3"
                  onClick={() => setSelectedCharacters([])}
                >
                  Clear
                </Button>
              </>
            ) : null}
            <Button
              onClick={() => {
                dispatch(actions.updateConfigs(updateConfigs));
                setUpdateConfigs({});
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 cursor-pointer">
        {activeItems.map((item) => (
          <div key={item.id}>
            <PointsCard
              roundImg={activeMenu === 'characters'}
              key={item.id}
              item={{
                ...item,
                avatar: item.icon,
                points:
                  updateConfigs?.[item.id]?.points ||
                  systemConfigs?.[item.id]?.points ||
                  0,
              }}
              onClick={(id, action) => {
                if (action === 'select') {
                  handleSelect(id);
                } else {
                  setEditPoints(id);
                }
              }}
              selected={selectedCharacters.includes(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsAdjuster;
