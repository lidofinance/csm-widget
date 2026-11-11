import { UPLOAD_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { MatomoLink } from 'shared/components';
import { useFormData } from 'shared/hook-form/form-controller';
import { DepositDataField } from 'shared/hook-form/fields';
import { validationMessage } from 'shared/hook-form/validation';
import type { AddKeysFormInputType, AddKeysFormNetworkData } from '../context';

export const KeysInput: FC = () => {
  const { isCsmFamily, module } = useModule();
  const token = useWatch<AddKeysFormInputType, 'token'>({ name: 'token' });
  const { errors } = useFormState<AddKeysFormInputType>({ name: 'bondAmount' });
  const { keysAvailable } = useFormData<AddKeysFormNetworkData>();
  const affordable = keysAvailable?.[token].byBalance;
  const highlightFrom =
    affordable !== undefined &&
    errors.bondAmount?.message ===
      validationMessage.cannotUploadMoreKeys(affordable)
      ? affordable
      : undefined;

  return (
    <DepositDataField
      module={module}
      label="Upload deposit data"
      showGuideNote={isCsmFamily}
      highlightFrom={highlightFrom}
      action={
        isCsmFamily ? (
          <MatomoLink
            href={UPLOAD_DEPOSIT_DATA_LINK}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
          >
            Learn more
          </MatomoLink>
        ) : undefined
      }
    />
  );
};
