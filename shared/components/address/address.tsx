import { FC } from 'react';
import { AddressInner, AddressProps } from './address-inner';
import { useEnsAvatar, useEnsName } from 'shared/hooks';
import { isAddress } from 'ethers/lib/utils.js';

export const Address: FC<AddressProps> = (props) => {
  const address =
    props.address && isAddress(props.address) ? props.address : undefined;
  const { data: ensName } = useEnsName(address);
  const { data: ensAvatar } = useEnsAvatar(ensName ?? undefined);

  return (
    <AddressInner
      {...props}
      name={ensName ?? undefined}
      avatar={ensAvatar ?? undefined}
    />
  );
};
