import { Grid, StackStyle } from 'shared/components';
import styled from 'styled-components';

const CARD_MIN_WIDTH = 220;

export const CardsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(${CARD_MIN_WIDTH}px, 1fr));
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
