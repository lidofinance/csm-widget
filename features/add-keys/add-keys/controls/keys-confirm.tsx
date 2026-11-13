import {
  SHARE_LIMIT_STATUS,
  useModule,
  useShareLimitStatus,
} from 'modules/web3';
import { MODULE_METADATA } from 'consts/module';
import { FC } from 'react';
import { useDepositDataValid } from 'shared/hook-form/deposit-data';
import { CheckboxField } from 'shared/hook-form/fields';
import { KEYS_CONFIRM_CM } from '../add-keys-state';
import { KeysConfirmLines } from './keys-confirm-lines';

const ConfirmText: FC = () => {
  const { isCsmFamily, module } = useModule();
  const { data: status } = useShareLimitStatus();

  if (!isCsmFamily || !module) return <>{KEYS_CONFIRM_CM}</>;

  return (
    <KeysConfirmLines
      approaching={status === SHARE_LIMIT_STATUS.APPROACHING}
      reached={status === SHARE_LIMIT_STATUS.REACHED}
      name={MODULE_METADATA[module].variantName}
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
