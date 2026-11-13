import { Text } from '@lidofinance/lido-ui';
import { MODULE_METADATA } from 'consts/module';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { CheckboxHookForm } from 'shared/hook-form/controls';
import { useDepositDataValid } from 'shared/hook-form/deposit-data';
import { useSubmitKeysFormData } from '../context';
import { SHARE_LIMIT_STATUS } from 'modules/web3';

export const KeysConfirm: FC = () => {
  const { shareLimitStatus, targetModule } = useSubmitKeysFormData(true);
  const name = MODULE_METADATA[targetModule].variantName;
  const isDepositDataValid = useDepositDataValid();

  return (
    <Stack align="start">
      <CheckboxHookForm
        fieldName="confirmKeysReady"
        disabled={!isDepositDataValid}
      />
      <Text size="xxs" color="secondary" as="div">
        I confirm that:
        <ul>
          <li>
            My nodes are synced, running, and ready for the validator activation
          </li>
          {shareLimitStatus === SHARE_LIMIT_STATUS.APPROACHING && (
            <li>
              I understand that the deposit time for my keys can be months or
              longer because {name} is approaching its stake share limit
            </li>
          )}
          {shareLimitStatus === SHARE_LIMIT_STATUS.REACHED && (
            <li>
              I understand that my newly uploaded keys are very unlikely to
              receive deposits in the near future because {name} has reached its
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
