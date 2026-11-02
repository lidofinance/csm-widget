import { KeysConfirmLines } from 'features/add-keys/add-keys/controls/keys-confirm-lines';
import { SHARE_LIMIT_STATUS } from 'modules/web3';
import { FC } from 'react';
import { useDepositDataValid } from 'shared/hook-form/deposit-data';
import { CheckboxField } from 'shared/hook-form/fields';
import { useSubmitKeysFormData } from '../context';

export const KeysConfirm: FC = () => {
  const { shareLimitStatus } = useSubmitKeysFormData();
  const isDepositDataValid = useDepositDataValid();

  return (
    <CheckboxField
      name="confirmKeysReady"
      disabled={!isDepositDataValid}
      label={
        <KeysConfirmLines
          approaching={shareLimitStatus === SHARE_LIMIT_STATUS.APPROACHING}
          reached={shareLimitStatus === SHARE_LIMIT_STATUS.REACHED}
        />
      }
    />
  );
};
