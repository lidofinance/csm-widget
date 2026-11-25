import { useDappStatus } from 'modules/web3';

import { CuratedOperatorForm } from './curated-operator-form';

export const CreateCuratedNodeOperator = () => {
  const { address, chainId } = useDappStatus();

  // Not useWeb3Key: it follows the active operator, so the first appendNO would remount and drop the success state
  return <CuratedOperatorForm key={`${address ?? 'NO_ACCOUNT'}_${chainId}`} />;
};
