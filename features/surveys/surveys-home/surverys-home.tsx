import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { WhenLoaded } from 'shared/components';
import {
  SurveyLink,
  SurveyItem,
  SurveySection,
  SurveyButton,
} from '../components';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { ContactData } from '../survey-contacts';
import { SetupRawData } from '../survey-setup';
import { useConfirmEraseModal } from './confirm-erase-modal';
import { Divider } from '@lidofinance/lido-ui';

type Summary = {
  contacts: ContactData | null;
  setups: SetupRawData[];
  meta: {
    keysCount: number;
  };
};

export const SurveysHome: FC = () => {
  const { data, isLoading, remove } = useSurveysSWR<Summary>('summary');

  const confirmModal = useConfirmEraseModal();

  const handleErase = useCallback(async () => {
    if (await confirmModal({})) {
      await remove();
    }
  }, [confirmModal, remove]);

  return (
    <WhenLoaded loading={!data && isLoading}>
      <SurveySection
        title="Your contact information"
        subtitle="How this information will be used"
        help="Lido contributors will attempt to contact you in case you are offline or unresponsive to important matters on the mainnet. However, we cannot guarantee that you will be notified."
      >
        <SurveyItem title="Contact information">
          <SurveyLink
            title={data?.contacts ? 'Filled' : 'Fill in'}
            color={data?.contacts ? 'secondary' : 'primary'}
            path={PATH.SURVEYS_CONTACTS}
          />
        </SurveyItem>
      </SurveySection>

      <SurveySection
        title="Your setups"
        subtitle="How this information will be used"
        help="Information is voluntarily submitted and only retained for report building. Information is aggregated and utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
      >
        {data?.setups.map((setup) => (
          <SurveyItem key={setup.id} title={`Setup #${setup.id}`}>
            <SurveyLink
              title="Edit"
              path={`${PATH.SURVEYS_SETUP}/${setup.id}`}
            />
          </SurveyItem>
        ))}

        <SurveyLink title="Add new setup" fullwidth path={PATH.SURVEYS_SETUP} />
      </SurveySection>

      {(data?.contacts || (data?.setups && data.setups.length > 0)) && (
        <>
          <Divider />
          <SurveySection title="Erase your data">
            <SurveyButton
              title="Erase all data from the database"
              fullwidth
              color="error"
              onClick={handleErase}
            />
          </SurveySection>
        </>
      )}
    </WhenLoaded>
  );
};
