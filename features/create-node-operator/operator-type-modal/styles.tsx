import { Modal } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import styled from 'styled-components';

const MODAL_WIDTH: Record<number, number> = {
  1: 640,
  2: 640,
  3: 800,
};

export const StyledModal = styled(Modal)<{ $columns: number }>`
  & > div {
    width: ${({ $columns }) => MODAL_WIDTH[$columns] ?? 1000}px;
    max-width: 100%;
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

export const ParameterRowStyle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;
