import { FC } from 'react';
import { KeysLimitWarning as SharedKeysLimitWarning } from 'shared/components';
import { getKeysLimitState } from '../add-keys-state';
import { useAddKeysFormData } from '../context';

const useKeysLimitInput = () => {
  const { curveParameters, operatorInfo } = useAddKeysFormData();

  return {
    keysLimit: curveParameters?.keysLimit,
    nonWithdrawnKeys: operatorInfo
      ? operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys
      : undefined,
  };
};

export const useKeysLimit = () => getKeysLimitState(useKeysLimitInput());

export const KeysLimitWarning: FC = () => (
  <SharedKeysLimitWarning {...useKeysLimitInput()} />
);
