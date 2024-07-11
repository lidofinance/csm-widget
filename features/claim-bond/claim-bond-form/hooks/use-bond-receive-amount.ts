import { Zero } from '@ethersproject/constants';
import { useWatch } from 'react-hook-form';
import { ClaimBondFormInputType } from '../context';
import { useClaimBondFormNetworkData } from '../context/use-claim-bond-form-network-data';
import { useStethAmount } from './use-steth-amount';

export const useBondReceiveAmount = () => {
  const [token, amount] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimRewards']
  >({
    name: ['token', 'amount', 'claimRewards'],
  });

  const { rewards } = useClaimBondFormNetworkData();

  const stethAmount = useStethAmount(token, amount ?? Zero);
  const bondReceive = rewards?.available.sub(stethAmount ?? Zero) ?? Zero;

  return bondReceive.lt(0) ? Zero : bondReceive;
};
