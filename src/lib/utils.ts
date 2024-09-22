import { nanoid } from '@reduxjs/toolkit';
import { type ClassValue, clsx } from 'clsx';
import _, { range } from 'lodash';
import { twMerge } from 'tailwind-merge';

export const generateID = (
  ids: string[] = [],
  size = 5,
  options: { prefix?: string } = {},
): string => {
  const id = `${options?.prefix ?? ''}${nanoid(size)}`;
  if (ids.includes(id)) return generateID(ids, size);
  return id;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const determineTurn = (
  ban: number,
  pick: number,
  firstPick: number,
): { player: number; type: string }[] => {
  const players = firstPick === 1 ? [1, 2] : [2, 1];
  const newOrder: { player: number; type: string }[] = [
    { player: players[0], type: 'ban' },
  ];
  _.chunk(range(1, ban), 2).forEach((chunk, index) => {
    newOrder.push(
      ...chunk.map(() => ({
        player: index % 2 ? players[0] : players[1],
        type: 'ban',
      })),
    );
  });

  newOrder.push({ player: players[0], type: 'pick' });
  _.chunk(range(1, pick), 2).forEach((chunk, index) => {
    newOrder.push(
      ...chunk.map(() => ({
        player: index % 2 ? players[0] : players[1],
        type: 'pick',
      })),
    );
  });
  return newOrder;
};
