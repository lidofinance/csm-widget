import { ABOUT_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useFormState } from 'react-hook-form';
import { FormTitle, MatomoLink } from 'shared/components';
import { DepositDataInputHookForm } from 'shared/hook-form/controls';
import { AddKeysFormInputType } from '../context';

export const KeysInput = () => {
  const { errors } = useFormState<AddKeysFormInputType>({
    name: ['depositData', 'rawDepositData'],
  });
  const error = errors.rawDepositData?.message || errors.depositData?.message;

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
    </>
  );
};
