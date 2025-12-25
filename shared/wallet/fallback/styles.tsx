import { HatBlock } from 'shared/components';
import styled from 'styled-components';

export const FallbackWalletStyle = styled(HatBlock)`
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
