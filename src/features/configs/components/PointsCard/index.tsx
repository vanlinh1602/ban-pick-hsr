import { FiEdit2 } from 'react-icons/fi';

import { Checkbox } from '@/components/ui/checkbox';
type Props = {
  item: {
    name: string;
    points: number;
    avatar: string;
    id: string;
  };
  selected: boolean;
  onClick: (id: string, action: 'select' | 'edit') => void;
};

const PointsCard = ({ item, selected, onClick }: Props) => {
  return (
    <div
      key={item.id}
      className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 ${
        selected ? 'ring-2 ring-blue-500' : ''
      } flex justify-between`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col text-start overflow-hidden">
          <p className="text-xl font-semibold line-clamp-1">{item.name}</p>
          <p className="text-gray-600">Points: {item.points}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between">
        <Checkbox
          id={item.id}
          checked={selected}
          onCheckedChange={() => {
            onClick(item.id, 'select');
          }}
        />
        <FiEdit2
          className="text-xl text-blue-400"
          onClick={() => onClick(item.id, 'edit')}
        />
      </div>
    </div>
  );
};

export default PointsCard;
