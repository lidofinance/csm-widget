import { ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const DropZoneContainer = styled.div<{ hasError: boolean }>`
  border: ${({ hasError, theme }) =>
    hasError
      ? `1px dashed  ${theme.colors.error}`
      : `1px dashed ${theme.colors.primary}`};
  padding: 3em;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  color: ${({ theme }) => theme.colors.textSecondary};

  background-color: var(--lido-color-controlBg);

  &:hover {
    border: ${({ hasError, theme }) =>
      hasError
        ? `1px solid ${theme.colors.error}`
        : `1px solid ${theme.colors.primary}`};
    background-color: ${({ theme }) =>
      theme.name === ThemeName.light ? '#F6F8FA' : '#252a2e'};
  }
`;

export const KeystoreFileRow = styled.div`
  display: flex;
  align-items: center;

  > div {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.error};
    font-weight: 700;
  }

  > p {
    margin-right: 8px;
  }
`;
