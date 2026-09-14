import { Text } from '@lidofinance/lido-ui';
import {
  SHARE_LIMIT_STATUS,
  useModule,
  useShareLimitStatus,
} from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { CheckboxHookForm } from 'shared/hook-form/controls';
import { useDepositDataValid } from 'shared/hook-form/deposit-data';

export const KeysConfirm: FC = () => {
  const { isCsmFamily } = useModule();
  const { data: status } = useShareLimitStatus();
  const isDepositDataValid = useDepositDataValid();

  return (
    <Stack align={isCsmFamily ? 'start' : 'center'}>
      <CheckboxHookForm
        fieldName="confirmKeysReady"
        disabled={!isDepositDataValid}
      />
      {isCsmFamily ? (
        <Text size="xxs" color="secondary" as="div">
          I confirm that:
          <ul>
            <li>
              My nodes are synced, running, and ready for the validator
              activation
            </li>
            {status === SHARE_LIMIT_STATUS.APPROACHING && (
              <li>
                I understand that the deposit time for my keys can be months or
                longer because CSM is approaching its stake share limit
              </li>
            )}
            {status === SHARE_LIMIT_STATUS.REACHED && (
              <li>
                I understand that my newly uploaded keys are very unlikely to
                receive deposits in the near future because CSM has reached its
                stake share limit
              </li>
            )}
            <li>
              I understand that deleting keys from the deposit queue will incur
              a removal fee
            </li>
          </ul>
        </Text>
      ) : (
        <Text size="xxs" color="secondary" as="div">
          I confirm that my nodes are synced, running, and ready for the
          validator activation
        </Text>
      )}
    </Stack>
  );
};
