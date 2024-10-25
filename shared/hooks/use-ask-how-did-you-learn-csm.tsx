import { useLocalStorage } from '@lido-sdk/react';
import { useMemo } from 'react';

export const useAskHowDidYouLearnCsm = () => {
  const [state, setState] = useLocalStorage<
    'ask' | 'answered' | 'closed' | undefined
  >(`ask-how-learn-csm`, undefined);

  return useMemo(
    () => ({
      canAsk: state === 'ask',
      ask: () => setState((prev) => (!prev ? 'ask' : prev)),
      answer: () => setState('answered'),
      rejectAnswer: () =>
        setState((prev) => (prev === 'answered' ? 'answered' : 'closed')),
    }),
    [setState, state],
  );
};
