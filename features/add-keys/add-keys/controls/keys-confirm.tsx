import {
  SHARE_LIMIT_STATUS,
  useModule,
  useShareLimitStatus,
} from 'modules/web3';
import { FC } from 'react';
import { useDepositDataValid } from 'shared/hook-form/deposit-data';
import { CheckboxField } from 'shared/hook-form/fields';
import { KEYS_CONFIRM_CM } from '../add-keys-state';
import { KeysConfirmLines } from './keys-confirm-lines';

const ConfirmText: FC = () => {
  const { isCsmFamily } = useModule();
  const { data: status } = useShareLimitStatus();

  if (!isCsmFamily) return <>{KEYS_CONFIRM_CM}</>;

  return (
    <KeysConfirmLines
      approaching={status === SHARE_LIMIT_STATUS.APPROACHING}
      reached={status === SHARE_LIMIT_STATUS.REACHED}
    />
  );
};

export const KeysConfirm: FC = () => {
  const isDepositDataValid = useDepositDataValid();

  return (
    <CheckboxField
      name="confirmKeysReady"
      disabled={!isDepositDataValid}
      label={<ConfirmText />}
    />
  );
};
