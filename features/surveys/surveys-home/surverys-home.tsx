import { Divider, Plus, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { Plural, Stack, WhenLoaded } from 'shared/components';
import {
  SurveyButton,
  SurveyItem,
  SurveyLink,
  SurveySection,
  Warning,
} from '../components';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { SetupsKeys, Summary } from '../types';
import { useConfirmEraseModal } from './confirm-erase-modal';

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

  const showErase = !!(
    data?.contacts ||
    data?.experience ||
    data?.howDidYouLearnCsm ||
    (data?.setups && data.setups.length > 0)
  );
  const showSetups = !!(keys && (keys.total > 0 || keys.filled > 0));

  return (
    <WhenLoaded loading={!data && isLoading}>
      <SurveySection
        title="Your contact information"
        subtitle="How this information will be used"
        help="Lido contributors will attempt to contact you in case you are offline or unresponsive to important matters on the Mainnet. However, we cannot guarantee that you will be notified"
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
        help="Information is voluntarily submitted and only retained for report building, UI/UX improvement, or feedback purposes. Information is aggregated. Information about your experience is utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports"
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

      {showSetups && (
        <SurveySection
          title="Your setup"
          subtitle="How this information will be used"
          help="Information is voluntarily submitted and only retained for report building. Information is aggregated and utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports"
        >
          {keys && keys.filled > keys.total && (
            <Warning>
              The number of your keys has decreased. Please update the data
            </Warning>
          )}
          {data?.setups.map((setup) => (
            <SurveyItem
              key={setup.index}
              title={
                <Stack>
                  Setup #{setup.index}{' '}
                  <Text as="span" size="sm" color="secondary">
                    {setup.keysCount}{' '}
                    <Plural
                      value={setup.keysCount}
                      variants={['key', 'keys']}
                    />
                  </Text>
                </Stack>
              }
            >
              <SurveyLink path={`${PATH.SURVEYS_SETUP}/${setup.index}`}>
                Edit
              </SurveyLink>
            </SurveyItem>
          ))}

          {keys && keys.left > 0 && (
            <SurveyLink
              icon={<Plus />}
              color="primary"
              variant="translucent"
              fullwidth
              path={PATH.SURVEYS_SETUP}
            >
              <>
                Add new setup
                <>
                  {' '}
                  ({keys.left}{' '}
                  <Plural value={keys.left} variants={['key', 'keys']} /> left)
                </>
              </>
            </SurveyLink>
          )}
        </SurveySection>
      )}

      {showErase && (
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
