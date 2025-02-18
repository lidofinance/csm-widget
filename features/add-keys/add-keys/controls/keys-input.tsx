import { ABOUT_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useFormState } from 'react-hook-form';
import { FormTitle, MatomoLink } from 'shared/components';
import { DepositDataInputHookForm } from 'shared/hook-form/controls';
import { AddKeysFormInputType } from '../context';
// DAPPNODE
import useCheckImportedDepositKeys from 'dappnode/hooks/use-check-deposit-keys';
import { KeysBrainUpload } from 'dappnode/import-keys/keys-input-form';
import { useFormContext } from 'react-hook-form';

export const KeysInput = () => {
  const { errors } = useFormState<AddKeysFormInputType>({
    name: ['depositData', 'rawDepositData'],
  });
  const error = errors.rawDepositData?.message || errors.depositData?.message;

  // DAPPNODE
  const { watch } = useFormContext<AddKeysFormInputType>();
  const depositDataValue = watch('depositData');
  const { missingKeys } = useCheckImportedDepositKeys(depositDataValue);

  return (
    <>
      <FormTitle
        extra={
          <MatomoLink
            href={ABOUT_DEPOSIT_DATA_LINK}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
          >
            Learn more
          </MatomoLink>
        }
      >
        Upload deposit data
      </FormTitle>
      <DepositDataInputHookForm error={error} />
      {missingKeys.length > 0 && (
        <KeysBrainUpload missingKeys={missingKeys} error={false} />
      )}
    </>
  );
};
