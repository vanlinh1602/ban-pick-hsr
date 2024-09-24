import { useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { FaTimes } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

import { Player } from '../../type';

type Props = {
  onClose: () => void;
  onConfirm: (data: Player[]) => void;
  data: Player[];
};

const PLayersOrder = ({ onClose, onConfirm, data }: Props) => {
  const [teams, setTeams] = useState<Player[]>(data);
  const removeTeam = (id: string) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newTeams = Array.from(teams);
    const [reorderedItem] = newTeams.splice(result.source.index, 1);
    newTeams.splice(result.destination.index, 0, reorderedItem);
    setTeams(newTeams);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Players Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="teams">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {teams.map((team, index) => (
                    <Draggable
                      key={team.id}
                      draggableId={team.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-2 bg-gray-100 rounded"
                        >
                          <span>{team.name}</span>
                          <button
                            onClick={() => removeTeam(team.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            Remove
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <Button onClick={() => onConfirm(teams)} className="mt-4">
          Save
        </Button>
      </div>
    </div>
  );
};

export default PLayersOrder;
