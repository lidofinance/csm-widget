import { FC } from 'react';
import { KeysLimitWarning as KeysLimitWarningBlock } from 'shared/components';
import { useSubmitKeysFormData } from '../context';

export const KeysLimitWarning: FC = () => {
  const { curveParameters } = useSubmitKeysFormData();

  return (
    <KeysLimitWarningBlock
      keysLimit={curveParameters?.keysLimit}
      nonWithdrawnKeys={0}
    />
  );
};
