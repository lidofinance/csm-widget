import { createContext } from 'react';
import type { SiweAuthContextType } from './types';

export const SiweAuthContext = createContext<SiweAuthContextType | null>(null);
