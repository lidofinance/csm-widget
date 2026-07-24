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
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { useClaimOptions } from '../hooks/use-claim-options';
import { FeeSplit } from '@lidofinance/lido-csm-sdk';

export const SourceSelect: FC = () => {
  const { options } = useClaimOptions();
  const { field } = useController<ClaimBondFormInputType, 'claimOption'>({
    name: 'claimOption',
  });

  return (
    <>
      <FormTitle extra={<SplittersChip />}>Select claiming option</FormTitle>
      <Stack direction="column" gap="ms">
        {options.map(({ option, label, description, disabled }) => (
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
                  <Text size="xs" weight={700} data-testid="claimOptionLabel">
                    {label}
                  </Text>
                </Stack>
                <Text
                  size="xxs"
                  color="secondary"
                  data-testid="claimOptionDescription"
                >
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
    <SquaredChip data-testid="splittersChip" variant="primary">
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
      proportions below
    </span>
    <Stack direction="column" gap="xxs">
      {feeSplits.map((split) => (
        <Stack
          key={split.recipient}
          gap="xs"
          justify="space-between"
          data-testid="splittersTooltipRow"
        >
          <Address address={split.recipient} link="" symbols={8} noStyle />
          <span>{formatShare(split.share)}</span>
        </Stack>
      ))}
    </Stack>
  </Stack>
);
