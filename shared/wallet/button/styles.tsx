import styled from 'styled-components';
import {
  AddressBadge,
  Button,
  ButtonProps,
  InlineLoader,
  InlineLoaderProps,
} from '@lidofinance/lido-ui';

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

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

export const WalledButtonLoaderStyle = styled((props: InlineLoaderProps) => (
  <InlineLoader {...props} />
))`
  width: 60px;
`;

export const AddressBadgeStyle = styled(AddressBadge)`
  margin: 0;
`;
