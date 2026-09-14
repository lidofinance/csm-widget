import { KeyStrikes } from '@lidofinance/lido-csm-sdk';
import { Box, Text } from '@lidofinance/lido-ui';
import { Tooltip } from 'shared/components';
import {
  useCurveParameters,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';
import { FC, useCallback } from 'react';
import { useStrikeDates } from 'shared/hooks';
import { formatDate, getArraySum } from 'utils';

export const StrikesCount: FC<{ strikes?: KeyStrikes }> = ({ strikes }) => {
  const { nodeOperator } = useNodeOperator();
  const { data: curve } = useOperatorCurveId(nodeOperator);
  const { data: max } = useCurveParameters(
    curve,
    (params) => params.strikesConfig.threshold,
  );

  const lastStrike = strikes?.findIndex((v) => !!v);
  const getDates = useStrikeDates(undefined);

  const count = getArraySum(strikes);
  const warning = max && count >= max;

  const content = (
    <Box minWidth="fit-content">
      <Text
        as="span"
        size="xs"
        color={warning ? 'error' : count > 0 ? 'default' : 'secondary'}
      >
        {count}
      </Text>
      <Text as="span" size="xs" color={warning ? 'error' : 'secondary'}>
        /{max?.toString() ?? 0}
      </Text>
    </Box>
  );

  const getTooltip = useCallback(
    (n: number) => {
      const dates = getDates(n);
      if (!dates) return null;

      return (
        <>Last Strike: {formatDate(dates?.receivedTimestamp, 'dd.MM.yyyy')}</>
      );
    },
    [getDates],
  );

  return (
    <>
      {lastStrike !== undefined ? (
        <Tooltip placement="left" title={getTooltip(lastStrike)}>
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </>
  );
};
