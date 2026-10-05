import { InlineLoader } from '@lidofinance/lido-ui';
import {
  useModule,
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
  useOperatorStakeSummary,
} from 'modules/web3';
import { FC, useMemo } from 'react';
import { computeStakeData } from 'utils';
import {
  StakeStats,
  KeyLimit,
  StakeRow,
  WrapperStyle,
} from 'features/group/shared';

export const StakeAndKeys: FC = () => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { data: stakeSummary } = useOperatorStakeSummary({
    nodeOperatorId,
    module,
  });
  const { data: info } = useOperatorInfo({ nodeOperatorId });
  const { data: keys } = useOperatorKeysWithStatus({ nodeOperatorId });

  const data = useMemo(() => {
    if (stakeSummary && info) {
      return computeStakeData(stakeSummary, info, keys);
    }
    return undefined;
  }, [stakeSummary, info, keys]);

  return data ? (
    <WrapperStyle>
      <StakeStats data={data} />
      <KeyLimit info={info} />
    </WrapperStyle>
  ) : (
    <StakeRow>
      <InlineLoader />
    </StakeRow>
  );
};
