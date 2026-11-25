import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { CreatableOperatorType } from 'shared/hooks';

import { SubmitKeysForm } from './submit-keys-form';

export const CreateNodeOperator: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => {
  const { address, chainId } = useDappStatus();
  // Not useWeb3Key: the first appended operator changes the active module and id, which would drop the success state
  const key = `${address ?? 'NO_ACCOUNT'}_${chainId}`;

  return <SubmitKeysForm key={key} type={type} />;
};
