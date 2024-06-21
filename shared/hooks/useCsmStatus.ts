import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { useCallback } from 'react';
import { useAccount } from './use-account';
import { useCSModuleRPC } from './useCsmContracts';
import { AddressZero } from '@ethersproject/constants';
import { getCSMContractAddress } from 'consts/csm-contracts';
import { getSettledValue } from 'utils';

export const useCsmStatus = (config = STRATEGY_EAGER) => {
  const { chainId } = useAccount();
  const contract = useCSModuleRPC();

  const fetcher = useCallback(async () => {
    const earlyAdoptionAddress = getCSMContractAddress(
      chainId,
      'CSEarlyAdoption',
    );

    const [isPaused, isPublicRelease] = await Promise.allSettled([
      contract.isPaused(),
      contract.publicRelease(),
    ]);
    // TODO: `isReleased` to config
    // FIXME: `isReleased` = any CSM contract is not working

    return {
      isReleased: true,
      isPaused: getSettledValue(isPaused),
      isPublicRelease: getSettledValue(isPublicRelease),
      isEarlyAdoption:
        earlyAdoptionAddress && earlyAdoptionAddress !== AddressZero,
    };
  }, [chainId, contract]);

  return useLidoSWR(['csm-status', chainId], fetcher, config);
};
