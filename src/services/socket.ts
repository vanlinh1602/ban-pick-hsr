import { io } from 'socket.io-client';

import { BACKEND } from '@/config';

export const socket = io(BACKEND);
