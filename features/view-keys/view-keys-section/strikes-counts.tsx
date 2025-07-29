import { KeyStrikes } from '@lidofinance/lido-csm-sdk';
import { Box, Text } from '@lidofinance/lido-ui';
import {
  useCurveParameters,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { FC } from 'react';
import { getSum } from 'shared/hooks';

export const StrikesCount: FC<{ strikes?: KeyStrikes }> = ({ strikes }) => {
  const id = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(id);
  const { data: max } = useCurveParameters(
    curveId,
    (params) => params.strikesConfig.threshold,
  );

  const count = getSum(strikes);
  const warning = max && count >= max;

  return (
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
};
