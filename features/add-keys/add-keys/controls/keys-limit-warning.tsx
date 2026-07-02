import { FC } from 'react';
import { KeysLimitWarning as KeysLimitWarningBlock } from 'shared/components';
import { useAddKeysFormData } from '../context';

export const KeysLimitWarning: FC = () => {
  const { curveParameters, operatorInfo } = useAddKeysFormData();

  return (
    <KeysLimitWarningBlock
      keysLimit={curveParameters?.keysLimit}
      nonWithdrawnKeys={
        operatorInfo
          ? operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys
          : undefined
      }
    />
  );
};
