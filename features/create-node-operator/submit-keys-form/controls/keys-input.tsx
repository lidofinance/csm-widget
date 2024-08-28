import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useFormState } from 'react-hook-form';
import { FormTitle, MatomoLink } from 'shared/components';
import { DepositDataInputHookForm } from 'shared/hook-form/controls';
import { SubmitKeysFormInputType } from '../context';

export const KeysInput = () => {
  const { errors } = useFormState<SubmitKeysFormInputType>({
    name: ['depositData', 'rawDepositData'],
  });
  const error = errors.rawDepositData?.message || errors.depositData?.message;

  return (
    <>
      <FormTitle>
        Upload deposit data
        <MatomoLink
          href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
        >
          Learn more
        </MatomoLink>
      </FormTitle>
      <DepositDataInputHookForm error={error} />
    </>
  );
};
