import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, RadioIcon, Stack } from 'shared/components';
import {
  useClaimIdvtcFormData,
  type ClaimIdvtcFormInputType,
  type ClaimIdvtcMode,
} from '../context';

const OPTIONS: {
  value: ClaimIdvtcMode;
  title: string;
  description: string;
}[] = [
  {
    value: 'upgrade',
    title: 'Upgrade ICS to IDVTC',
    description:
      'Claiming the Identified DVT Cluster operator type will change some parameters for your node operator according to the section below.',
  },
  {
    value: 'create',
    title: 'Create a new IDVTC operator',
    description:
      'Creating a separate Node Operator with the Identified DVT Cluster operator type will keep your current ICS status alongside with the new IDVTC type.',
  },
];

export const ModeSelector: FC = () => {
  const { isCurrentIcs } = useClaimIdvtcFormData();
  const { field } = useController<ClaimIdvtcFormInputType, 'mode'>({
    name: 'mode',
  });

  if (!isCurrentIcs) return null;

  return (
    <Stack direction="column">
      {OPTIONS.map(({ value, title, description }) => (
        <RadioButton
          key={value}
          {...field}
          value={value}
          checked={value === field.value}
        >
          <Stack gap="sm" center>
            <RadioIcon />
            <Stack direction="column" gap="xxs">
              <Text size="xs">{title}</Text>
              <Text size="xxs" color="secondary">
                {description}
              </Text>
            </Stack>
          </Stack>
        </RadioButton>
      ))}
    </Stack>
  );
};
