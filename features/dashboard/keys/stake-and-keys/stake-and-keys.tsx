import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { InlineLoader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { pluralKeys } from 'utils';
import { useStakeAndKeys } from './use-stake-and-keys';
import {
  ColorDot,
  StakeAmount,
  StakeBar,
  StakeBarSegment,
  StakeColumn,
  StakeKeys,
  StakeRow,
  StakeTitle,
} from './styles';

const COLORS = {
  active: '#53ba95',
  depositable: '#00a3ff',
  potential: '#b8bcc1',
} as const;

const getPercent = (part: bigint, total: bigint) =>
  total > 0n ? Number((part * 10000n) / total) / 100 : 0;

export const StakeAndKeys: FC = () => {
  const { data, isPending } = useStakeAndKeys();

  if (isPending || !data) {
    return (
      <StakeRow>
        <InlineLoader />
      </StakeRow>
    );
  }

  const totalStake =
    data.activeStake + data.depositableStake + data.potentialAdditionalStake;

  return (
    <Stack direction="column" gap="sm">
      <StakeRow>
        <StakeColumn>
          <StakeTitle>
            <ColorDot $color={COLORS.active} />
            Active
            <IconTooltip tooltip="Active stake based on effective balance of active validators" />
          </StakeTitle>
          <StakeAmount>
            <FormatToken
              amount={data.activeStake}
              token={TOKENS.eth}
              maxDecimalDigits={0}
            />
          </StakeAmount>
          <StakeKeys>
            {pluralKeys({ value: data.activeKeys, showValue: true })}
          </StakeKeys>
        </StakeColumn>

        <StakeColumn>
          <StakeTitle>
            <ColorDot $color={COLORS.depositable} />
            Depositable
            <IconTooltip tooltip="Stake from depositable keys awaiting deposit from the Lido protocol" />
          </StakeTitle>
          <StakeAmount>
            <FormatToken
              amount={data.depositableStake}
              token={TOKENS.eth}
              maxDecimalDigits={0}
            />
          </StakeAmount>
          <StakeKeys>
            {pluralKeys({ value: data.depositableKeys, showValue: true })}
          </StakeKeys>
        </StakeColumn>

        <StakeColumn>
          <StakeTitle>
            <ColorDot $color={COLORS.potential} />
            Potential additional capacity
            <IconTooltip tooltip="Additional stake capacity available based on target allocation" />
          </StakeTitle>
          <StakeAmount>
            <FormatToken
              amount={data.potentialAdditionalStake}
              token={TOKENS.eth}
              maxDecimalDigits={0}
            />
          </StakeAmount>
          <StakeKeys>
            {pluralKeys({
              value: data.potentialAdditionalKeys,
              showValue: true,
            })}
          </StakeKeys>
        </StakeColumn>
      </StakeRow>

      <StakeBar>
        <StakeBarSegment
          $color={COLORS.active}
          $width={getPercent(data.activeStake, totalStake)}
        />
        <StakeBarSegment
          $color={COLORS.depositable}
          $width={getPercent(data.depositableStake, totalStake)}
        />
        <StakeBarSegment
          $color={COLORS.potential}
          $width={getPercent(data.potentialAdditionalStake, totalStake)}
        />
      </StakeBar>
    </Stack>
  );
};
