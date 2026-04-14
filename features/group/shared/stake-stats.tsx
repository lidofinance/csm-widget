import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { getPercent, pluralKeys, StakeAndKeysData } from 'utils';
import {
  ColorDot,
  StakeBar,
  StakeBarSegment,
  StakeColumn,
  StakeRow,
} from './styles';

export const STAKE_COLORS = {
  active: '#53ba95',
  depositable: '#00a3ff',
  potential: '#b8bcc1',
} as const;

type Props = {
  data?: StakeAndKeysData;
};

export const StakeStats: FC<Props> = ({ data }) => {
  if (!data) return null;

  const totalStake =
    data.activeStake + data.depositableStake + data.potentialAdditionalStake;

  return (
    <Stack direction="column" gap="sm">
      <StakeRow>
        <StakeColumn>
          <Stack center gap="xs">
            <ColorDot $color={STAKE_COLORS.active} />
            <Text size="xs">Active</Text>
            <IconTooltip tooltip="Stake amount that already has ETH deposited by the Lido protocol and are currently active in the validator set" />
          </Stack>
          <Stack direction="column" gap="none">
            <Text as="b" weight={700} size="sm">
              <FormatToken
                amount={data.activeStake}
                token={TOKENS.eth}
                maxDecimalDigits={2}
                trimTrailingZeros
              />
            </Text>
            <Text size="xxs" color="secondary">
              {pluralKeys({ value: data.activeKeys, showValue: true })}
            </Text>
          </Stack>
        </StakeColumn>

        <StakeColumn>
          <Stack center gap="xs">
            <ColorDot $color={STAKE_COLORS.depositable} />
            <Text size="xs">Depositable</Text>
            <IconTooltip tooltip="Available capacity ready to receive stake from the Lido protocol" />
          </Stack>
          <Stack direction="column" gap="none">
            <Text as="b" weight={700} size="sm">
              <FormatToken
                amount={data.depositableStake}
                token={TOKENS.eth}
                maxDecimalDigits={2}
                trimTrailingZeros
              />
            </Text>
            <Text size="xxs" color="secondary">
              {pluralKeys({ value: data.depositableKeys, showValue: true })}
            </Text>
          </Stack>
        </StakeColumn>

        <StakeColumn>
          <Stack center gap="xs">
            <ColorDot $color={STAKE_COLORS.potential} />
            <Text size="xs">Potential additional capacity</Text>
            <IconTooltip tooltip="The additional stake the Lido protocol could allocate based on current weight, assuming enough validator keys are available" />
          </Stack>
          <Stack direction="column" gap="none">
            <Text as="b" weight={700} size="sm">
              <FormatToken
                amount={data.potentialAdditionalStake}
                token={TOKENS.eth}
                maxDecimalDigits={2}
                trimTrailingZeros
              />
            </Text>
            <Text size="xxs" color="secondary">
              {pluralKeys({
                value: data.potentialAdditionalKeys,
                showValue: true,
              })}
            </Text>
          </Stack>
        </StakeColumn>
      </StakeRow>

      <StakeBar>
        <StakeBarSegment
          $color={STAKE_COLORS.active}
          $width={getPercent(data.activeStake, totalStake)}
        />
        <StakeBarSegment
          $color={STAKE_COLORS.depositable}
          $width={getPercent(data.depositableStake, totalStake)}
        />
        <StakeBarSegment
          $color={STAKE_COLORS.potential}
          $width={getPercent(data.potentialAdditionalStake, totalStake)}
        />
      </StakeBar>
    </Stack>
  );
};
