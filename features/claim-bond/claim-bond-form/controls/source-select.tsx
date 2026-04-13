import { FC } from 'react';
import { useController } from 'react-hook-form';
import { FormTitle, RadioButton, RadioIcon, Stack } from 'shared/components';
import { Text } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { ReactComponent as BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';

import {
  ClaimBondFormInputType,
  ClaimOption,
  useClaimBondFormData,
  getOptionSet,
  getOptionMeta,
  OptionEntry,
} from '../context';

const OptionIcon: FC<{ type: 'bond' | 'reward' }> = ({ type }) =>
  type === 'bond' ? (
    <SmallIcon as={BondIcon} />
  ) : (
    <SmallIcon as={RewardsIcon} />
  );

export const SourceSelect: FC = () => {
  const { bond, rewards } = useClaimBondFormData(true);
  const optionSet = getOptionSet({ bond, rewards });

  const { field } = useController<ClaimBondFormInputType, 'claimOption'>({
    name: 'claimOption',
  });

  return (
    <>
      <FormTitle>Select claiming option</FormTitle>
      <Stack direction="column" gap="ms">
        {optionSet.options.map((entry) => (
          <ClaimOptionRadio
            key={entry.value}
            entry={entry}
            bond={bond}
            selected={field.value}
            onChange={field.onChange}
          />
        ))}
      </Stack>
    </>
  );
};

type ClaimOptionRadioProps = {
  entry: OptionEntry;
  bond: Parameters<typeof getOptionMeta>[1];
  selected: ClaimOption;
  onChange: (value: ClaimOption) => void;
};

const ClaimOptionRadio: FC<ClaimOptionRadioProps> = ({
  entry,
  bond,
  selected,
  onChange,
}) => {
  const meta = getOptionMeta(entry.value, bond);

  return (
    <RadioButton
      name="claimOption"
      value={entry.value}
      checked={entry.value === selected}
      disabled={entry.disabled}
      onChange={() => onChange(entry.value)}
    >
      <Stack gap="sm" center>
        <RadioIcon />
        <Stack direction="column" gap="xxs">
          <Stack gap="xs" center>
            <Stack gap="none" center>
              {meta.icons.map((icon) => (
                <OptionIcon key={icon} type={icon} />
              ))}
            </Stack>
            <Text size="xs" weight={700}>
              {meta.label}
            </Text>
          </Stack>
          <Text size="xxs" color="secondary">
            {meta.description}
          </Text>
        </Stack>
      </Stack>
    </RadioButton>
  );
};

const SmallIcon = styled.svg`
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
`;
