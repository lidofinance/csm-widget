import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { getKeysLimitState } from '../add-keys-state';
import { useAddKeysFormData } from '../context';

export const useKeysLimit = () => {
  const { curveParameters, operatorInfo } = useAddKeysFormData();

  return getKeysLimitState({
    keysLimit: curveParameters?.keysLimit,
    nonWithdrawnKeys: operatorInfo
      ? operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys
      : undefined,
  });
};

export const KeysLimitWarning: FC = () => {
  const keysLimit = useKeysLimit();

  if (!keysLimit) return null;

  return (
    <MessageBox variant="warning" dataTestId={{ root: 'keysLimitWarning' }}>
      {keysLimit.message}
    </MessageBox>
  );
};
