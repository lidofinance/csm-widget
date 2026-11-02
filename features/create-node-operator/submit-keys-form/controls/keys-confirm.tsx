import { getKeysConfirmItems } from 'features/add-keys/add-keys/add-keys-state';
import { SHARE_LIMIT_STATUS } from 'modules/web3';
import { FC } from 'react';
import { useDepositDataValid } from 'shared/hook-form/deposit-data';
import { CheckboxField } from 'shared/hook-form/fields';
import { useSubmitKeysFormData } from '../context';
import { ConfirmItemStyle, ConfirmTextStyle } from './styles';

export const KeysConfirm: FC = () => {
  const { shareLimitStatus } = useSubmitKeysFormData();
  const isDepositDataValid = useDepositDataValid();
  const items = getKeysConfirmItems({
    approaching: shareLimitStatus === SHARE_LIMIT_STATUS.APPROACHING,
    reached: shareLimitStatus === SHARE_LIMIT_STATUS.REACHED,
  });

  return (
    <CheckboxField
      name="confirmKeysReady"
      disabled={!isDepositDataValid}
      label={
        <ConfirmTextStyle>
          <span>I confirm that:</span>
          {items.map((item) => (
            <ConfirmItemStyle key={item}>{item}</ConfirmItemStyle>
          ))}
        </ConfirmTextStyle>
      }
    />
  );
};
