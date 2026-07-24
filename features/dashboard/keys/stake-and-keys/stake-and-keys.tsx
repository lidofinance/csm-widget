import { InlineLoader } from '@lidofinance/lido-ui';
import {
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
  useOperatorStakeSummary,
} from 'modules/web3';
import { FC, useMemo } from 'react';
import { computeStakeData } from 'utils';
import { StakeStats, KeyLimit, StakeRow } from 'features/group/shared';

export const StakeAndKeys: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: stakeSummary } = useOperatorStakeSummary(nodeOperatorId);
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: keys } = useOperatorKeysWithStatus(nodeOperatorId);

  const data = useMemo(() => {
    if (stakeSummary && info) {
      return computeStakeData(stakeSummary, info, keys);
    }
    return undefined;
  }, [stakeSummary, info, keys]);

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
