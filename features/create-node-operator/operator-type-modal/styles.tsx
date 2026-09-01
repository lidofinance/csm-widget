import { Modal } from '@lidofinance/lido-ui';
import { Grid, StackStyle } from 'shared/components';
import styled, { css } from 'styled-components';

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

const CARD_MIN_WIDTH = 220;
// modal chrome around the grid: overlay padding (20) + content padding (32) per side, plus rounding slack
const MODAL_CHROME = 112;

const columnsBreakpoint = (columns: number, gap: number) =>
  columns * CARD_MIN_WIDTH + (columns - 1) * gap + MODAL_CHROME;

export const CardsGrid = styled(Grid)<{ $columns: number }>`
  ${({ $columns, theme }) => {
    const gap = theme.spaceMap.md;
    const halfRow = Math.ceil($columns / 2);
    return css`
      grid-template-columns: 1fr;

      @media (min-width: ${columnsBreakpoint(halfRow, gap)}px) {
        grid-template-columns: repeat(${halfRow}, minmax(0, 1fr));
      }

      @media (min-width: ${columnsBreakpoint($columns, gap)}px) {
        grid-template-columns: repeat(${$columns}, minmax(0, 1fr));
      }
    `;
  }}
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
