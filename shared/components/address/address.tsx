import { FC } from 'react';
import { AddressInner, AddressProps } from './address-inner';
import { isAddress } from 'viem';
import { useEnsName } from 'wagmi';

export const Address: FC<AddressProps> = (props) => {
  const address =
    props.address && isAddress(props.address) ? props.address : undefined;
  const { data: ensName } = useEnsName({ address });

  return <AddressInner {...props} name={ensName ?? undefined} />;
};
