import { Tooltip } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { formatDate } from 'utils/format-date';
import type { StrikeDotsState } from './get-strike-dots';

const Dots = styled.span`
  display: inline-flex;
  gap: 4px;
`;

const Dot = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--lido-app-ui-color-background-default);

  &[data-filled='true'] {
    background: var(--lido-app-ui-color-icons-error);
  }
`;

export const StrikeDotsView: FC<
  StrikeDotsState & { lastStrikeDate?: number }
> = ({ count, filled, threshold, lastStrikeDate }) => {
  const dots = (
    <Dots role="img" aria-label={`${count}/${threshold} strikes`}>
      {Array.from({ length: threshold }, (_, i) => (
        <Dot key={i} data-filled={i < filled} />
      ))}
    </Dots>
  );

  if (lastStrikeDate === undefined) return dots;

  return (
    <Tooltip
      content={`Last Strike: ${formatDate(lastStrikeDate, 'dd.MM.yyyy')}`}
    >
      {dots}
    </Tooltip>
  );
};
