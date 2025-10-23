import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { getMaxBalanceToken } from 'modules/web3';
import { useModifyContext } from 'providers/modify-provider';
import { useFormDefaultValues } from 'shared/hook-form/form-controller';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export const useSubmitKeysDefaultValues = () => {
  const { referrer } = useModifyContext();

  return useFormDefaultValues<
    SubmitKeysFormInputType,
    SubmitKeysFormNetworkData
  >((data) => ({
    token: getMaxBalanceToken({
      [TOKENS.eth]: data.ethBalance,
      [TOKENS.steth]: data.stethBalance,
      [TOKENS.wsteth]: data.wstethBalance,
    }),
    depositData: [],
    rawDepositData: '',
    confirmKeysReady: false,
    extendedManagerPermissions: false,
    specifyCustomAddresses: false,
    specifyReferrrer: false,
    referrer,
  }));
};
