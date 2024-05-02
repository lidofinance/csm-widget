import { AddressBadge, useWalletModal } from 'shared/wallet';
import { Component } from 'types';
import { Address } from 'wagmi';
import { HatAccountStyle } from './styles';

export const HatAccount: Component<'div', { address?: Address | null }> = (
  props,
) => {
  const { address, ...rest } = props;
  const { openModal } = useWalletModal();

  return (
    <HatAccountStyle {...rest}>
      <AddressBadge
        data-testid="accountSectionCard"
        address={address}
        onClick={() => openModal({})}
        color="accent"
      />
    </HatAccountStyle>
  );
};
