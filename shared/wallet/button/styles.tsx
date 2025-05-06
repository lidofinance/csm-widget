import styled from 'styled-components';
import {
  Button,
  ButtonProps,
  InlineLoader,
  InlineLoaderProps,
} from '@lidofinance/lido-ui';
import { NAV_MOBILE_MEDIA } from 'styles/constants';
import { Address } from 'shared/components';

export const WalledButtonStyle = styled((props: ButtonProps) => (
  <Button {...props} />
))`
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;
`;

export const WalledButtonWrapperStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: -10px -18px;
`;

export const WalledButtonBalanceStyle = styled.span`
  margin-right: 12px;
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;

  ${NAV_MOBILE_MEDIA} {
    display: none;
  }
`;

export const WalledButtonLoaderStyle = styled((props: InlineLoaderProps) => (
  <InlineLoader {...props} />
))`
  width: 60px;
`;

export const AddressBadgeStyle = styled.span`
  border-radius: 1000px;
  padding: 4px;
  display: inline-flex;

  background: var(--lido-color-background);

  & > * {
    flex-direction: row-reverse;
    gap: 0;

    & > :last-child {
      padding-inline: 6px;
      flex-shrink: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const AddressStyle = styled((props) => (
  <Address
    big
    showIcon
    link={false}
    color="secondary"
    weight={400}
    {...props}
  />
))``;
