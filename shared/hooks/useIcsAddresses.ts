import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { compareLowercase, standardFetcher } from 'utils';
import { Address } from 'wagmi';
import { useAccount } from './use-account';

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
