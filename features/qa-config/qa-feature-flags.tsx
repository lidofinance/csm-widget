import { FC, useMemo } from 'react';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Checkbox, Text } from '@lidofinance/lido-ui';

import {
  DISABLE_DEPOSIT_DATA_VALIDATION,
  FeatureFlagsType,
  getFeatureFlagsDefault,
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
  useFeatureFlags,
} from 'config/feature-flags';
import { useUserConfig } from 'config/user-config';
import { FormBlock, Stack } from 'shared/components';

const FLAG_LABELS: Record<keyof FeatureFlagsType, string> = {
  [ICS_APPLY_FORM]: 'Operator type applications (ICS, IDVTC)',
  [SURVEYS_SETUP_ENABLED]: 'Surveys (setup & delegation)',
  [DISABLE_DEPOSIT_DATA_VALIDATION]: 'Disable deposit data validation',
};

const FLAGS = Object.keys(getFeatureFlagsDefault()) as Array<
  keyof FeatureFlagsType
>;

const TESTNET_ONLY_FLAGS: Array<keyof FeatureFlagsType> = [
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
];

export const QaFeatureFlags: FC = () => {
  const featureFlags = useFeatureFlags();
  const { defaultChain } = useUserConfig();

  const flags = useMemo(
    () =>
      defaultChain === CHAINS.Mainnet
        ? FLAGS.filter((flag) => !TESTNET_ONLY_FLAGS.includes(flag))
        : FLAGS,
    [defaultChain],
  );

  if (!featureFlags) return null;

  return (
    <FormBlock>
      <Text size="sm" strong>
        Feature flags
      </Text>
      <Stack direction="column" gap="sm">
        {flags.map((flag) => (
          <Checkbox
            key={flag}
            label={FLAG_LABELS[flag] ?? flag}
            checked={featureFlags[flag]}
            onChange={(e) =>
              featureFlags.setFeatureFlag(flag, e.currentTarget.checked)
            }
          />
        ))}
      </Stack>
    </FormBlock>
  );
};
