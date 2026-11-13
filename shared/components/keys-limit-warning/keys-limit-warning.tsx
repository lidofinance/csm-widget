import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { getKeysLimitState, KeysLimitInput } from './keys-limit-state';

export const KeysLimitWarning: FC<KeysLimitInput> = (input) => {
  const state = getKeysLimitState(input);

  if (!state) return null;

  return (
    <MessageBox variant="warning" dataTestId={{ root: 'keysLimitWarning' }}>
      {state.message}
    </MessageBox>
  );
};
