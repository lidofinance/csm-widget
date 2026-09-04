import { UPLOAD_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useModule } from 'modules/web3';
import { FormTitle, MatomoLink } from 'shared/components';
import { DepositDataHookForm } from 'shared/hook-form/controls';

export const KeysInput = () => {
  const { isCsmFamily } = useModule();

  return (
    <>
      <FormTitle
        extra={
          isCsmFamily ? (
            <MatomoLink
              href={UPLOAD_DEPOSIT_DATA_LINK}
              matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
            >
              Learn more
            </MatomoLink>
          ) : null
        }
      >
        Upload deposit data
      </FormTitle>

      <DepositDataHookForm />
    </>
  );
};
