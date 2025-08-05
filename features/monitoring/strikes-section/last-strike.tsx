import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useStrikeDates } from 'shared/hooks';
import { formatDate } from 'utils';

export const LastStrike: FC<{ strikes: number[] }> = ({ strikes }) => {
  const n = strikes.findIndex((v) => !!v);
  const dates = useStrikeDates(n);

  if (!dates) {
    return <InlineLoader />;
  }

  return (
    <Text size="xs" color="secondary">
      Last Strike: {formatDate(dates?.receivedTimestamp, 'dd.MM.yyyy')}
    </Text>
  );
};
