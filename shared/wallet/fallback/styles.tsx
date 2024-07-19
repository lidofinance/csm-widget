import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const FallbackWalletStyle = styled(Block)`
  margin-bottom: -52px;

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  padding-bottom: ${({ theme }) =>
    theme.borderRadiusesMap.xl + theme.spaceMap.xxl}px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-bottom: ${({ theme }) =>
      theme.borderRadiusesMap.xl + theme.spaceMap.lg}px;
  }

  text-align: center;
  background: var(--lido-color-error);
  background-image: none !important;
  color: var(--lido-color-errorContrast);
`;
