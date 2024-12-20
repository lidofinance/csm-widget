import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { CheckboxHookForm } from 'shared/hook-form/controls';
import { SHARE_LIMIT_STATUS } from 'shared/hooks';
import { useAddKeysFormData } from '../context';

export const KeysConfirm: FC = () => {
  const { shareLimit } = useAddKeysFormData();

  return (
    <Stack align="start">
      <CheckboxHookForm fieldName="confirmKeysReady" />
      <Text size="xxs" color="secondary">
        I confirm that:
        <ul>
          <li>
            My nodes are synced, running, and ready for the validator activation
          </li>
          {shareLimit?.status === SHARE_LIMIT_STATUS.APPROACHING && (
            <li>
              I understand that the deposit time for my keys can be months or
              longer because CSM is approaching its stake share limit
            </li>
          )}
          {shareLimit?.status === SHARE_LIMIT_STATUS.REACHED && (
            <li>
              I understand that my newly uploaded keys are very unlikely to
              receive deposits in the near future because CSM has reached its
              stake share limit
            </li>
          )}
          <li>
            I understand that deleting keys from the deposit queue will incur a
            removal fee
          </li>
        </ul>
      </Text>
    </Stack>
  );
};
