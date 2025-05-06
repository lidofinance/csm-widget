import { isAddress } from 'ethers/lib/utils.js';
import { FC } from 'react';
import { useEnsName } from 'shared/hooks';
import { AddressInner, AddressProps } from './address-inner';

export const Address: FC<AddressProps> = (props) => {
  const address =
    props.address && isAddress(props.address) ? props.address : undefined;
  const { data: ensName } = useEnsName(address);

  return <AddressInner {...props} name={ensName ?? undefined} />;
};
