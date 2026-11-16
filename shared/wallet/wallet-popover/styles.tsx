import { Copy, Popover, Stack, Typography } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

import { popoverBeak } from 'shared/components/popover-beak';
import { EtherscanAddressLink } from 'shared/components/external-icon-link/etherscan-address-link';

export const PopupStyle = styled(Popover)`
  && {
    align-items: center;
    gap: 32px;
    padding: 32px;
  }

  ${popoverBeak}
`;

export const AccountStyle = styled(Stack).attrs({ align: 'center', gap: 24 })`
  width: 100%;
`;

export const AvatarStyle = styled.div`
  position: relative;
  display: flex;
`;

export const BadgeStyle = styled.span`
  position: absolute;
  right: -4px;
  bottom: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: 50%;
  background: var(--lido-app-ui-color-background-surface);

  img,
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const AddressRowStyle = styled(Stack).attrs({
  direction: 'row',
  align: 'center',
  justify: 'center',
  gap: 8,
})`
  width: 100%;
  /* app-ui Copy sizes its icon as 1lh - 4px, i.e. 20px */
  line-height: 24px;
`;

export const AddressStyle = styled(Typography).attrs({
  variant: 'h3',
  weight: 'medium',
  color: 'default',
  forwardedAs: 'span',
})`
  line-height: 36px;
`;

export const CopyStyle = styled(Copy)`
  color: var(--lido-app-ui-color-icons-secondary);
`;

export const EtherscanLinkStyle = styled(EtherscanAddressLink)`
  && {
    flex-shrink: 0;
    color: var(--lido-app-ui-color-icons-secondary);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
