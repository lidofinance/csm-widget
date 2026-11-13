import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useMemo } from 'react';
import { getBondTokenOptions, TokenSelectField } from 'shared/hook-form/fields';
import { LocalLink } from 'shared/navigate';
import { useSubmitKeysFormData } from '../context';

export const TokenSelect: FC = () => {
  const data = useSubmitKeysFormData(true);
  const options = useMemo(() => getBondTokenOptions(data), [data]);

  return (
    <TokenSelectField
      name="token"
      label="Choose bond token"
      options={options}
      action={
        <LocalLink
          anchor="#how-much-bond-is-needed"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
        >
          How bond is calculated
        </LocalLink>
      }
    />
  );
};
