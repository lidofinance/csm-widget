import { UPLOAD_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FormTitle, MatomoLink } from 'shared/components';
import { DepositDataHookForm } from 'shared/hook-form/controls';

export const KeysInput = () => {
  return (
    <>
      <FormTitle
        extra={
          <MatomoLink
            href={UPLOAD_DEPOSIT_DATA_LINK}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
          >
            Learn more
          </MatomoLink>
        }
      >
        Upload deposit data
      </FormTitle>

      <DepositDataHookForm />
    </>
  );
};
