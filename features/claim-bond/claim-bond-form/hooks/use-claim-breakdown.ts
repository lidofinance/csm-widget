import {
  convertEthToShares,
  convertSharesToEth,
  type StethPoolData,
} from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import {
  ClaimBreakdown,
  ClaimBreakdownInput,
  computeClaimBreakdown,
  ShareConverter,
} from '../claim-breakdown';
import {
  ClaimBondFormInputType,
  ClaimBondFormNetworkData,
  useClaimBondFormData,
} from '../context';

export const getShareConverter = (poolData: StethPoolData): ShareConverter => ({
  toShares: (steth) => convertEthToShares(steth, poolData),
  toSteth: (shares) => convertSharesToEth(shares, poolData),
});

export const getClaimBreakdown = (
  input: ClaimBreakdownInput,
  data: ClaimBondFormNetworkData,
): ClaimBreakdown =>
  computeClaimBreakdown(input, data, getShareConverter(data.poolData));

export const useClaimBreakdown = (): ClaimBreakdown => {
  const data = useClaimBondFormData(true);
  const [token, amount, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimOption']
  >({ name: ['token', 'amount', 'claimOption'] });

  return getClaimBreakdown({ token, amount, claimOption }, data);
};
