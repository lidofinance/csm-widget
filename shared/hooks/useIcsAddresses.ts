import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { compareLowercase, standardFetcher } from 'utils';
import { Address } from 'wagmi';
import { useAccount } from './use-account';
import { useNodeOperatorOwner } from './useNodeOperatorOwner';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMergeSwr } from './useMergeSwr';

const ICS_ADDRESSES_URL =
  'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/mainnet/ics/addresses.json';

export const useIcsAddresses = (config = STRATEGY_IMMUTABLE) => {
  return useLidoSWR(
    ['ics-addresses', ICS_ADDRESSES_URL],
    async () => standardFetcher<Address[]>(ICS_ADDRESSES_URL, { headers: {} }),
    config,
  );
};

export const useIcsAddressCheck = () => {
  const { address } = useAccount();
  const { data: addresses, ...swr } = useIcsAddresses();

  const isAddressInList = useMemo(() => {
    if (!addresses) return false;
    return addresses.some((a) => compareLowercase(a, address));
  }, [addresses, address]);

  return { ...swr, data: isAddressInList };
};

export const useIcsOwnerCheck = () => {
  const id = useNodeOperatorId();
  const ownerSwr = useNodeOperatorOwner(id);
  const listSwr = useIcsAddresses();

  const { data: owner } = ownerSwr;
  const { data: addresses } = listSwr;

  const isAddressInList = useMemo(() => {
    if (!addresses || !owner) return false;
    return addresses.some((a) => compareLowercase(a, owner.address));
  }, [addresses, owner]);

  return useMergeSwr([ownerSwr, listSwr], isAddressInList);
};
