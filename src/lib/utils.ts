import { type ClassValue, clsx } from 'clsx';
import _, { range } from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const determineTurn = (
  ban: number,
  pick: number,
): { player: number; type: string }[] => {
  const newOrder: { player: number; type: string }[] = [
    { player: 1, type: 'ban' },
  ];
  _.chunk(range(1, ban), 2).forEach((chunk, index) => {
    newOrder.push(
      ...chunk.map(() => ({ player: index % 2 ? 1 : 2, type: 'ban' })),
    );
  });

  newOrder.push({ player: 1, type: 'pick' });
  _.chunk(range(1, pick), 2).forEach((chunk, index) => {
    newOrder.push(
      ...chunk.map(() => ({ player: index % 2 ? 1 : 2, type: 'pick' })),
    );
  });
  return newOrder;
};
