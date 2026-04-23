import { FC } from 'react';
import { useController } from 'react-hook-form';
import { FormTitle, RadioButton, RadioIcon, Stack } from 'shared/components';
import { Text } from '@lidofinance/lido-ui';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFormData,
} from '../context';
import { getClaimOption } from './get-claim-option';

const OPTIONS: readonly CLAIM_OPTION[] = [
  CLAIM_OPTION.ALL_TO_RA,
  CLAIM_OPTION.BOND_TO_RA,
  CLAIM_OPTION.REWARDS_TO_BOND,
];

export const SourceSelect: FC = () => {
  const { bond, rewards, availableOptions } = useClaimBondFormData(true);

  const { field } = useController<ClaimBondFormInputType, 'claimOption'>({
    name: 'claimOption',
  });

  return (
    <>
      <FormTitle>Select claiming option</FormTitle>
      <Stack direction="column" gap="ms">
        {OPTIONS.map((option) => ({
          option,
          disabled: availableOptions.indexOf(option) < 0,
          ...getClaimOption(option, { bond, rewards }),
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
