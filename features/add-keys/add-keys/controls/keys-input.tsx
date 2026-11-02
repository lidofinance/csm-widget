import { UPLOAD_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { DepositDataField } from 'shared/hook-form/fields';

export const KeysInput: FC = () => {
  const { isCsmFamily, module } = useModule();

  return (
    <DepositDataField
      module={module}
      label="Upload deposit data"
      showGuideNote={isCsmFamily}
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
