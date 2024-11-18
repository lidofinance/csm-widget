import { useLocalStorage } from '@lido-sdk/react';
import { useMemo } from 'react';

export const useAskHowDidYouLearnCsm = () => {
  const [state, setState] = useLocalStorage<
    'ask' | 'answered' | 'closed' | undefined
  >(`ask-how-learn-csm`, undefined);

  return useMemo(
    () => ({
      canAsk: !state || state === 'ask',
      ask: () => !state && setState('ask'),
      answer: () => setState('answered'),
      rejectAnswer: () => state !== 'answered' && setState('closed'),
    }),
    [setState, state],
  );
};
