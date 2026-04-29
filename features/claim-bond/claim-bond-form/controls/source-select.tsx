import { FC } from 'react';
import { useController } from 'react-hook-form';
import {
  Address,
  FormTitle,
  IconTooltip,
  RadioButton,
  RadioIcon,
  SquaredChip,
  Stack,
} from 'shared/components';
import { Text } from '@lidofinance/lido-ui';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFormData,
} from '../context';
import { getClaimOption } from './get-claim-option';
import { FeeSplit } from '@lidofinance/lido-csm-sdk';

const OPTIONS: readonly CLAIM_OPTION[] = [
  CLAIM_OPTION.ALL_TO_RA,
  CLAIM_OPTION.BOND_TO_RA,
  CLAIM_OPTION.REWARDS_TO_BOND,
];

export const SourceSelect: FC = () => {
  const { bond, rewards, availableOptions, feeSplits } =
    useClaimBondFormData(true);

  const { field } = useController<ClaimBondFormInputType, 'claimOption'>({
    name: 'claimOption',
  });

  return (
    <>
      <FormTitle extra={<SplittersChip />}>Select claiming option</FormTitle>
      <Stack direction="column" gap="ms">
        {OPTIONS.map((option) => ({
          option,
          disabled: availableOptions.indexOf(option) < 0,
          ...getClaimOption(option, { bond, rewards, feeSplits }),
        }))
          .sort((a, b) => Number(a.disabled) - Number(b.disabled))
          .map(({ option, label, description, disabled }) => (
            <RadioButton
              key={option}
              name="claimOption"
              value={option}
              checked={option === field.value}
              disabled={disabled}
              onChange={() => field.onChange(option)}
            >
              <Stack gap="sm" center>
                <RadioIcon />
                <Stack direction="column" gap="xxs">
                  <Stack gap="xs" center>
                    <Text size="xs" weight={700}>
                      {label}
                    </Text>
                  </Stack>
                  <Text size="xxs" color="secondary">
                    {description}
                  </Text>
                </Stack>
              </Stack>
            </RadioButton>
          ))}
      </Stack>
    </>
  );
};

const formatShare = (share: bigint) => `${Number(share) / 100}%`;

const SplittersChip: FC = () => {
  const { feeSplits } = useClaimBondFormData(true);

  if (feeSplits.length === 0) return null;

  return (
    <SquaredChip variant="primary">
      SPLITTERS ON{' '}
      <IconTooltip
        placement="bottomRight"
        tooltip={<SplittersTooltip feeSplits={feeSplits} />}
      />
    </SquaredChip>
  );
};

const SplittersTooltip: FC<{ feeSplits: FeeSplit[] }> = ({ feeSplits }) => (
  <Stack direction="column" gap="ms">
    <span>
      When you claim rewards, they will be distributed according to the
      proportions below.
    </span>
    <Stack direction="column" gap="xxs">
      {feeSplits.map((split) => (
        <Stack key={split.recipient} gap="xs" justify="space-between">
          <Address address={split.recipient} link="" symbols={8} noStyle />
          <span>{formatShare(split.share)}</span>
        </Stack>
      ))}
    </Stack>
  </Stack>
);
