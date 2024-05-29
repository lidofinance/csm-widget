import { useCallback, useMemo } from 'react';
import { useMaxGasPrice } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { type AcceptInviteFormNetworkData } from './types';

export const useAcceptInviteFormNetworkData =
  (): AcceptInviteFormNetworkData => {
    const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
    const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
      useMaxGasPrice();

    const revalidate = useCallback(async () => {
      await Promise.allSettled([]);
    }, []);

    const loading = useMemo(
      () => ({
        isMultisigLoading,
        isMaxGasPriceLoading,
      }),
      [isMultisigLoading, isMaxGasPriceLoading],
    );

    return {
      isMultisig: isMultisigLoading ? undefined : isMultisig,
      maxGasPrice,
      loading,
      revalidate,
    };
  };
