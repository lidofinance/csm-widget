import { InlineLoader } from '@lidofinance/lido-ui';
import {
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorStakeSummary,
} from 'modules/web3';
import { FC, useMemo } from 'react';
import { computeStakeData } from 'utils';
import { StakeStats, KeyLimit, StakeRow } from 'features/group/shared';

export const StakeAndKeys: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: stakeSummary } = useOperatorStakeSummary(nodeOperatorId);
  const { data: info } = useOperatorInfo(nodeOperatorId);

  const data = useMemo(() => {
    if (stakeSummary && info) {
      return computeStakeData(stakeSummary, info);
    }
    return undefined;
  }, [stakeSummary, info]);

  return data ? (
    <>
      <StakeStats data={data} />
      <KeyLimit info={info} />
    </>
  ) : (
    <StakeRow>
      <InlineLoader />
    </StakeRow>
  );
};
