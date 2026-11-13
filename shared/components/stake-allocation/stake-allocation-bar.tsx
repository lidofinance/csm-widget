import { ProgressBar } from '@lidofinance/lido-app-ui';
import { formatEther } from 'viem';
import { FC } from 'react';
import type { StakeAndKeysData } from 'utils/compute-stake-data';
import { getStakeBarScale } from './get-stake-bar-scale';

type Props = {
  data: StakeAndKeysData;
  weightZero?: boolean;
};

const toEth = (value: bigint) => Number(formatEther(value));

export const StakeAllocationBar: FC<Props> = ({ data, weightZero }) => {
  const active = toEth(data.activeStake);
  const depositable = toEth(data.depositableStake);
  const target = toEth(data.targetStake);

  return (
    <ProgressBar
      segments={[
        { value: active, color: 'success' },
        { value: depositable, color: 'active' },
      ]}
      {...getStakeBarScale({ active, depositable, target, weightZero })}
      aria-label="Stake allocation"
      dataTestId={{ root: 'stakeBar' }}
    />
  );
};
