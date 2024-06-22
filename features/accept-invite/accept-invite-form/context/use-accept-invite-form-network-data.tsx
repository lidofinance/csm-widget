import { useCallback, useMemo } from 'react';
import { useInvites, useMaxGasPrice } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { type AcceptInviteFormNetworkData } from './types';

export const useAcceptInviteFormNetworkData =
  (): AcceptInviteFormNetworkData => {
    const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
    const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
      useMaxGasPrice();

    const {
      data: invites,
      initialLoading: isInvitesLoading,
      update: updateInvites,
    } = useInvites();

    const revalidate = useCallback(async () => {
      await Promise.allSettled([updateInvites()]);
    }, [updateInvites]);

    const loading = useMemo(
      () => ({
        isMultisigLoading,
        isMaxGasPriceLoading,
        isInvitesLoading,
      }),
      [isMultisigLoading, isMaxGasPriceLoading, isInvitesLoading],
    );

    return {
      isMultisig: isMultisigLoading ? undefined : isMultisig,
      maxGasPrice,
      invites,
      loading,
      revalidate,
    };
  };
