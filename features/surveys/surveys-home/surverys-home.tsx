import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { Plural, Stack, WhenLoaded } from 'shared/components';
import {
  SurveyLink,
  SurveyItem,
  SurveySection,
  SurveyButton,
} from '../components';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { useConfirmEraseModal } from './confirm-erase-modal';
import { Divider, Plus, Text } from '@lidofinance/lido-ui';
import { SetupsKeys, Summary } from '../types';

export const SurveysHome: FC = () => {
  const { data, isLoading, remove } = useSurveysSWR<Summary>('summary');
  const { data: keys, mutate: mutateKeys } =
    useSurveysSWR<SetupsKeys>('setups/keys');

  const confirmModal = useConfirmEraseModal();

  const handleErase = useCallback(async () => {
    if (await confirmModal({})) {
      await remove();
      void mutateKeys();
    }
  }, [confirmModal, mutateKeys, remove]);

  return (
    <WhenLoaded loading={!data && isLoading}>
      <SurveySection
        title="Your contact information"
        subtitle="How this information will be used"
        help="Lido contributors will attempt to contact you in case you are offline or unresponsive to important matters on the mainnet. However, we cannot guarantee that you will be notified."
      >
        <SurveyItem title="Contact information">
          <SurveyLink
            color={data?.contacts ? 'secondary' : 'primary'}
            path={PATH.SURVEYS_CONTACTS}
          >
            {data?.contacts ? 'Filled' : 'Fill in'}
          </SurveyLink>
        </SurveyItem>
      </SurveySection>

      <SurveySection
        title="Your experience"
        subtitle="How this information will be used"
        help="Information is voluntarily submitted and only retained for report building, UI/UX improvement, or feedback purposes. Information is aggregated. Information about your experience is utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
      >
        <SurveyItem title="How did you learn about CSM?">
          <SurveyLink
            color={data?.howDidYouLearnCsm ? 'secondary' : 'primary'}
            path={PATH.SURVEYS_HOW_DID_YOU_LEARN_CSM}
          >
            {data?.howDidYouLearnCsm ? 'Filled' : 'Fill in'}
          </SurveyLink>
        </SurveyItem>
        <SurveyItem title="Your validation experience">
          <SurveyLink
            color={data?.experience ? 'secondary' : 'primary'}
            path={PATH.SURVEYS_EXPERIENCE}
          >
            {data?.experience ? 'Filled' : 'Fill in'}
          </SurveyLink>
        </SurveyItem>
      </SurveySection>

      <SurveySection
        title="Your setup"
        subtitle="How this information will be used"
        help="Information is voluntarily submitted and only retained for report building. Information is aggregated and utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
      >
        {data?.setups.map((setup) => (
          <SurveyItem
            key={setup.index}
            title={
              <Stack>
                Setup #{setup.index}{' '}
                <Text as="span" size="sm" color="secondary">
                  {setup.keysCount}{' '}
                  <Plural value={setup.keysCount} variants={['key', 'keys']} />
                </Text>
              </Stack>
            }
          >
            <SurveyLink path={`${PATH.SURVEYS_SETUP}/${setup.index}`}>
              Edit
            </SurveyLink>
          </SurveyItem>
        ))}

        <SurveyLink
          icon={<Plus />}
          color={keys?.left ? 'primary' : 'secondary'}
          variant="translucent"
          fullwidth
          path={PATH.SURVEYS_SETUP}
        >
          <>
            Add new setup
            {keys && (
              <>
                {' '}
                ({keys.left}{' '}
                <Plural value={keys.left} variants={['key', 'keys']} /> left)
              </>
            )}
          </>
        </SurveyLink>
      </SurveySection>

      {(data?.contacts ||
        data?.experience ||
        data?.howDidYouLearnCsm ||
        (data?.setups && data.setups.length > 0)) && (
        <>
          <Divider />
          <SurveySection title="Erase your data">
            <SurveyButton
              title="Erase all data from the database"
              fullwidth
              color="error"
              variant="translucent"
              onClick={handleErase}
            />
          </SurveySection>
        </>
      )}
    </WhenLoaded>
  );
};
