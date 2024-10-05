import { useTranslation } from 'react-i18next';
import { FiEdit2 } from 'react-icons/fi';

import { Checkbox } from '@/components/ui/checkbox';
import { translations } from '@/locales/translations';
type Props = {
  roundImg?: boolean;
  item: {
    name: string;
    points: number;
    rarity: any[];
    avatar: string;
    id: string;
  };
  selected: boolean;
  allowEdit?: boolean;
  onClick: (id: string, action: 'select' | 'edit') => void;
};

const PointsCard = ({
  item,
  selected,
  onClick,
  roundImg,
  allowEdit,
}: Props) => {
  const { t } = useTranslation();
  let rarityColor = '';
  if (item.rarity[0]?.id === '1719') {
    rarityColor = 'text-blue-400';
  } else if (['1468', '1725'].includes(item.rarity[0]?.id)) {
    rarityColor = 'text-purple-400';
  } else if (['1488', '1738'].includes(item.rarity[0]?.id)) {
    rarityColor = 'text-yellow-400';
  }
  return (
    <div
      key={item.id}
      className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 ${
        selected ? 'ring-2 ring-blue-500' : ''
      } flex justify-between`}
    >
      <div
        className="flex items-center space-x-4"
        onClick={() => onClick(item.id, 'select')}
      >
        <img
          src={item.avatar}
          alt={item.name}
          className={`w-16 h-16 ${roundImg ? 'rounded-full' : 'rounded'} object-cover`}
        />
        <div className="flex flex-col text-start overflow-hidden">
          <p className="text-base font-semibold line-clamp-1">{item.name}</p>
          <p className="text-sm text-gray-600">
            <b>{t(translations.rarity)}:</b>
            <b className={`ml-2 ${rarityColor}`}>
              {item.rarity[0]?.value || 'Unknown'}
            </b>
          </p>
          <p className="text-sm text-gray-600">
            <b>{t(translations.points)}:</b>
            <b className="ml-2">{item.points}</b>
          </p>
        </div>
      </div>
      {allowEdit ? (
        <div className="flex flex-col items-center justify-between">
          <Checkbox
            id={item.id}
            checked={selected}
            onCheckedChange={() => {
              onClick(item.id, 'select');
            }}
          />
          <FiEdit2
            className="text-xl text-blue-400 z-10"
            onClick={() => onClick(item.id, 'edit')}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PointsCard;
