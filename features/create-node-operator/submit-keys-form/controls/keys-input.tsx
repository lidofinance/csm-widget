import { UPLOAD_DEPOSIT_DATA_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { DepositDataField } from 'shared/hook-form/fields';
import { useSubmitKeysFormData } from '../context';

export const KeysInput: FC = () => {
  const { targetModule } = useSubmitKeysFormData(true);

  return (
    <DepositDataField
      module={targetModule}
      label="Upload deposit data"
      showGuideNote
      action={
        <MatomoLink
          href={UPLOAD_DEPOSIT_DATA_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
        >
          Learn more
        </MatomoLink>
      }
    />
  );
};
