import { Zero } from '@ethersproject/constants';
import { useWatch } from 'react-hook-form';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { useStethAmount } from './use-steth-amount';

export const useBondReceiveAmount = () => {
  const [token, amount] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimRewards']
  >({
    name: ['token', 'amount', 'claimRewards'],
  });

  const { rewards } = useClaimBondFormData();

  const stethAmount = useStethAmount(token, amount ?? Zero);
  const bondReceive = rewards?.available.sub(stethAmount ?? Zero) ?? Zero;

  return bondReceive.lt(0) ? Zero : bondReceive;
};
