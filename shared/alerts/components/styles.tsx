import { Button, CheckLarge, Input, Select } from '@lidofinance/lido-ui';
import { CloseButton } from 'shared/components/copy-button/close-button';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

// Inset column is viewport minus sidebar; wide enough for side alerts only from here
const ALERTS_BESIDE_COLUMN_MEDIA = '@media screen and (min-width: 1500px)';

export const AlertContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  box-sizing: border-box;
  width: 100%;
  max-width: calc(600px + var(--lido-app-ui-page-gutter) * 2);
  margin-inline: auto;
  padding: ${({ theme }) => theme.spaceMap.sm}px var(--lido-app-ui-page-gutter)
    0;

  :empty {
    display: none;
  }

  ${ALERTS_BESIDE_COLUMN_MEDIA} {
    position: absolute;
    right: 32px;
    top: 80px;
    width: calc((100% - 600px) / 2 - 64px);
    max-width: 300px;
    margin: 0;
    padding: 0;
  }
`;

export const AlertStyled = styled(StackStyle).attrs({
  $direction: 'column',
})`
  position: relative;
  gap: 2px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: var(--lido-color-foreground);
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;

export const AlertRed = styled(AlertStyled)`
  background: var(--lido-color-error);
`;

export const AlertClose = styled(CloseButton)`
  position: absolute;
  top: 6px;
  right: 6px;
  border-radius: 50%;
`;

export const StyledSelect = styled(Select)`
  > span {
    padding: 4px 8px 4px 12px;
  }

  input {
    letter-spacing: normal;
    text-transform: none;
    font-weight: 400;
  }
`;

export const StyledInput = styled(Input)`
  > span {
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    padding: 7px 12px;
  }

  input {
    line-height: 1.5em;
  }
`;

export const SuccessIcon = styled(CheckLarge)`
  padding: 20px;
  border: 2px solid var(--lido-color-success);
  border-radius: 50%;
  color: var(--lido-color-success);
`;

export const AlertButton = styled(Button).attrs({
  size: 'xs',
  color: 'secondary',
})`
  width: fit-content;
  white-space: break-spaces;
  line-height: ${({ theme }) => theme.fontSizesMap.sm}px;
`;
