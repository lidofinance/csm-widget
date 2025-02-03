import { Block, Table } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

/**
 * TABLE STYLES
 */
export const ViewKeysBlock = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;

export const TableStyle = styled(Table)`
  margin: -32px -32px;

  thead tr::before,
  thead tr::after,
  th {
    border-top: none;
  }

  th {
    padding: 24px 8px 16px 8px;
    min-width: 40px;
  }
  tr {
    padding: 0;
  }

  td,
  th {
    padding-left: 0;
    padding-right: 0;
  }

  td {
    padding: 15px 0;
  }

  th > div {
    text-align: center;
  }

  td {
    border-bottom: none;
  }

  tbody tr:nth-child(odd) {
    background-color: var(--lido-color-accentControlBg);
  }

  td > div > p {
    text-align: center;
  }
`;

export const TooltipIcon = styled.span`
  color: var(--lido-color-textSecondary);
  opacity: 0.5;
  border: solid 1px var(--lido-color-textSecondary);
  font-size: 10px;
  border-radius: 100%;
  padding: 0 4px;
  margin-left: 2px;
`;

export const AddressRow = styled(StackStyle).attrs({ $gap: 'xs' })`
  align-items: center;
  justify-content: center;
`;

/**
 * RANGE SELECTOR STYLES
 */
export const SelectedRangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  > div {
    background-color: var(--lido-color-foreground);
    padding: 4px 8px;
    border-radius: 4px;
  }
`;

export const RangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: var(--lido-color-textSecondary);
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
`;

export const RangeDropdown = styled.div`
  min-width: 70px;
  background-color: var(--lido-color-foreground);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  svg {
    transition: transform 0.3s ease-in-out;
    transform: ${({ isOpen }: { isOpen: boolean }) =>
      isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--lido-color-foreground);
  border: 1px solid var(--lido-color-border);
  border-radius: 8px;
  margin-top: 8px;
  padding: 8px 0;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;

  div {
    padding: 8px 16px;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
`;

/**
 * CHART STYLES
 */
export const ChartSectionWrapper = styled.div`
  width: 150%;
`;

export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

// Generate unique colors for validator lines
const colorPalette = ['#82ca9d', '#ff7300', '#8884d8', '#ffc658', '#0088FE'];
export const getColor = (index: number) =>
  colorPalette[index % colorPalette.length];

export const LegendWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  height: 400px;
  overflow-y: auto;
`;

export const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ color }) => color};
  cursor: pointer;

  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: ${({ color }) => color};
    border-radius: 50%;
  }

  :hover {
    opacity: 0.8;
  }
`;

export const ChartControlsWrapper = styled.div`
  color: var(--lido-color-textSecondary);
  margin: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
export const ChartControls = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 50%;
  > input {
    width: 100%;
  }
`;

export const NoteWrapper = styled.div`
  width: 70%;
`;

/**
 * PERFORMANCE CARDS STYLES
 */

export const PerformanceCardStyle = styled(StackStyle).attrs({ $gap: 'sm' })`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 16px 22px;
  background: var(--lido-color-foreground);
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const CardTooltipWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 10px;
`;
