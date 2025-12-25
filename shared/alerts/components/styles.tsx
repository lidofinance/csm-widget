import { Button, CheckLarge, Input, Select } from '@lidofinance/lido-ui';
import { CloseButton } from 'shared/components/copy-button/close-button';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';
import { MEDIA_QUERY_XXL } from 'styles';

export const AlertContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  margin: 0 auto;

  :not(:empty) {
    margin-top: 76px;
  }

  grid-area: none;
  position: absolute;
  right: 32px;
  top: 80px;
  width: calc(50% - 400px);
  max-width: 300px;
  grid-area: none;

  ${MEDIA_QUERY_XXL} {
    width: calc(50% - 350px);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-area: alerts;
    position: static;
    width: 100%;
    max-width: var(--layout-main-width);
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
