import {
  KeyNumberValueInterval,
  QueueConfig,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { formatDuration, intervalToDuration } from 'date-fns';
import { ReactNode } from 'react';
import { FormatToken } from 'shared/formatters';
import { formatPercent, pluralKeys } from 'utils';
import { maxUint128 } from 'viem';

export const formatPercentKeyIntervals = (
  intervals: KeyNumberValueInterval[] = [],
) => formatKeyIntervals(intervals, ({ value }) => formatPercent(value));

export const formatEthKeyIntervals = (
  intervals: KeyNumberValueInterval[] = [],
) =>
  formatKeyIntervals(intervals, ({ value }) => (
    <FormatToken amount={value} token={TOKENS.eth} />
  ));

const formatKeyIntervals = <T extends { minKeyNumber: number }>(
  intervals: T[],
  format: (item: T) => string | ReactNode,
): ReactNode[] =>
  intervals.map((item, index, array) => {
    const isFirst = index === 0;
    const isLast = index === array.length - 1;
    const value = (array.at(index + 1)?.minKeyNumber ?? 0) - item.minKeyNumber;
    const countText =
      isFirst && isLast
        ? 'all keys'
        : isLast
          ? 'subsequent keys'
          : isFirst
            ? `first ${pluralKeys({ value, showValue: value > 1 })}`
            : `next ${pluralKeys({ value, showValue: true })}`;
    return (
      <>
        {format(item)} for {countText}
      </>
    );
  });

export const formatQueues = (config?: QueueConfig): ReactNode[] =>
  !config || config.priority >= config.lowestPriority
    ? [<>all keys go through the general queue</>]
    : [
        <>
          {pluralKeys({
            value: config.maxDeposits,
            showValue: true,
          })}{' '}
          total may be deposited via the priority queue across operator lifetime
        </>,
        <>all other keys go through the general queue</>,
      ];

// TODO: format long numbers
export const formatKeysLimit = (keysLimit?: number): ReactNode[] => {
  return keysLimit === undefined || keysLimit >= maxUint128
    ? ['not set']
    : [pluralKeys({ value: keysLimit, showValue: true })];
};

export const formatSecondsDuration = (duration = 0): string =>
  formatDuration(intervalToDuration({ start: 0, end: duration * 1000 }));
