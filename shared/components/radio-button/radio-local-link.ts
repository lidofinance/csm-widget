import { ThemeName } from '@lidofinance/lido-ui';
import { LocalLink } from 'shared/navigate/local-link';
import styled, { css } from 'styled-components';

export const RadioLocalLink = styled(LocalLink)<{ $active?: boolean }>`
  display: flex;

  --padding-y: 16px;
  --padding-x: 12px;

  position: relative;
  padding: var(--padding-y) var(--padding-x);
  flex: 1 0 0%;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid var(--lido-color-border);

  background-color: ${({ theme }) =>
    theme.name === ThemeName.light ? '#F6F8FA' : '#252a2e'};

  ${({ $active }) =>
    ($active &&
      css`
        border: 2px solid var(--lido-color-primary);
        padding: calc(var(--padding-y) - 1px) calc(var(--padding-x) - 1px);
      `) ||
    ''}

  :hover:not(:has(:disabled)) {
    background-color: ${({ theme }) =>
      theme.name === ThemeName.light ? '#ebf8ff' : '#24343b'};
    ${({ $active }) =>
      (!$active &&
        css`
          border: 1px solid var(--lido-color-primary);
        `) ||
      ''}
  }

  :not(:has(:disabled)) {
    cursor: pointer;
  }
`;
