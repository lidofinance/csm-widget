import { Modal } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import styled from 'styled-components';

export const StyledModal = styled(Modal)<{ $compact?: boolean }>`
  & > div {
    width: ${({ $compact }) => ($compact ? 640 : 800)}px;
  }
`;

export const OptionCard = styled(StackStyle).attrs({
  $direction: 'column',
  $justify: 'space-between',
})`
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--lido-color-border);
  background-color: var(--lido-color-accentControlBg);
`;
