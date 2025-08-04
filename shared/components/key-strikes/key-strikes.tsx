import { Tooltip } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { useStrikeDates } from 'shared/hooks';
import { formatDate } from 'utils';
import { Stack } from '../stack';
import { Circle } from './styles';

export const KeyStrikes: FC<{ strikes: number[] }> = ({ strikes }) => {
  const getDates = useStrikeDates(undefined);

  const getTooltip = useCallback(
    (n: number) => {
      const dates = getDates(n);
      if (!dates) return null;

      return (
        <>
          Received: {formatDate(dates.receivedTimestamp, 'dd.MM.yyyy')}
          <br />
          Expires: {formatDate(dates.expireTimestamp, 'dd.MM.yyyy')}
        </>
      );
    },
    [getDates],
  );

  return (
    <Stack gap="xs">
      {strikes.map((s, i) => (
        <span key={i}>
          {s ? (
            <Tooltip placement="top" title={getTooltip(i)}>
              <Circle $red />
            </Tooltip>
          ) : (
            <Circle />
          )}
        </span>
      ))}
    </Stack>
  );
};
