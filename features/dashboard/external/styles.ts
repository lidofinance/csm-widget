import { ThemeName } from '@lidofinance/lido-ui';
import { MatomoLink } from 'shared/components';
import styled from 'styled-components';

export const StyledLink = styled(MatomoLink)`
  display: flex;
  flex-direction: column;
  flex: 1 0 47%;
  gap: 12px;
  align-items: start;

  border: 1px solid var(--lido-color-border);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: 12px;
  min-width: 240px;
  max-width: calc(50% - 8px);

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: unset;
  }

  cursor: pointer;

  :hover {
    background-color: ${({ theme }) =>
      theme.name === ThemeName.light ? '#ebf8ff' : '#24343b'};
  }
`;
