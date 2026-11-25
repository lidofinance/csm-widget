import {
  BodyLarge,
  Button,
  IconCheck,
  MessageBox,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import {
  HubList,
  HubRow,
  HubSection,
  Plural,
  WhenLoaded,
} from 'shared/components';
import { plural } from 'utils';
import {
  callSurvey,
  surveyRequest,
  useOperatorSurvey,
} from 'modules/surveys-sdk';
import { summaryDelete, summaryFindOne } from 'modules/surveys-sdk/generated';
import type { SummaryDto } from 'modules/surveys-sdk/generated';
import { SurveyCards } from '../components';
import { useSurveyContext } from '../surveys-provider';
import { MAX_DELEGATES } from '../types';
import { useSetupsKeys } from '../survey-setup/use-setups-keys';
import { useConfirmEraseModal } from './confirm-erase-modal-app';
import { FeedbackRow } from './feedback-row';
import { SetupRow } from './setup-row';

type FillRowProps = {
  title: string;
  filled: boolean;
  href: PATH;
};

const FillRow: FC<FillRowProps> = ({ title, filled, href }) => (
  <HubList>
    <HubRow
      title={title}
      trailing={
        filled ? (
          <Tag variant="neutral" icon={<IconCheck />} href={href}>
            Filled
          </Tag>
        ) : (
          <Button size="small" href={href}>
            Fill in
          </Button>
        )
      }
    />
  </HubList>
);

type CountRowProps = {
  title: string;
  count?: number;
  href: PATH;
};

const CountRow: FC<CountRowProps> = ({ title, count, href }) => (
  <HubList>
    <HubRow
      title={
        <>
          {title}{' '}
          <BodyLarge as="span" color="tertiary">
            {count}
          </BodyLarge>
        </>
      }
      trailing={
        <Button size="small" variant="outline" href={href}>
          Manage
        </Button>
      }
    />
  </HubList>
);

export const SurveysOperatorHome: FC = () => {
  const { data, isLoading, remove } = useOperatorSurvey<SummaryDto>('summary', {
    get: ({ nodeOperatorId, token, signal }) =>
      callSurvey(() =>
        summaryFindOne({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId },
        }),
      ),
    // summaryDelete returns the now-empty SummaryDto (200, not 204); the hook's
    // delete contract is void, so discard the body.
    remove: async ({ nodeOperatorId, token }) => {
      await callSurvey(() =>
        summaryDelete({
          ...surveyRequest(token),
          path: { nodeOperatorId },
        }),
      );
    },
  });
  const { data: keys, mutate: mutateKeys } = useSetupsKeys();
  const { delegatedOperators } = useSurveyContext();

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
    (data?.setups && data.setups.items.length > 0)
  );
  const showSetups = !!(keys && (keys.total > 0 || keys.filled > 0));

  return (
    <WhenLoaded loading={!data && isLoading}>
      <Stack direction="column" gap={52}>
        <HubSection
          title="Your contact information"
          tooltip="Lido contributors will attempt to contact you in case you are offline or unresponsive to important matters on the Mainnet. However, we cannot guarantee that you will be notified."
        >
          <SurveyCards>
            <FillRow
              title="Contact information"
              filled={!!data?.contacts}
              href={PATH.SURVEYS_CONTACTS}
            />
          </SurveyCards>
        </HubSection>

        <HubSection
          title="Your experience"
          tooltip="Information is voluntarily submitted and only retained for report building, UI/UX improvement, or feedback purposes. Information is aggregated. Information about your experience is utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
        >
          <SurveyCards>
            <FillRow
              title="How did you learn about CSM?"
              filled={!!data?.howDidYouLearnCsm}
              href={PATH.SURVEYS_HOW_DID_YOU_LEARN_CSM}
            />
            <FillRow
              title="Your validation experience"
              filled={!!data?.experience}
              href={PATH.SURVEYS_EXPERIENCE}
            />
          </SurveyCards>
        </HubSection>

        {showSetups && (
          <HubSection
            title="Your setup"
            tooltip="Information is voluntarily submitted and only retained for report building. Information is aggregated and utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
          >
            {keys && keys.filled > keys.total && (
              <MessageBox variant="warning">
                The number of your keys has decreased. Please update the data.
              </MessageBox>
            )}
            <SurveyCards>
              {data?.setups.items.map((setup) => (
                <SetupRow
                  key={setup.index}
                  setup={setup}
                  editHref={`${PATH.SURVEYS_SETUP}/${setup.index}`}
                />
              ))}
              {keys && keys.left > 0 && (
                <Button variant="outline" fullWidth href={PATH.SURVEYS_SETUP}>
                  Add new setup ({keys.left}{' '}
                  <Plural value={keys.left} variants={['key', 'keys']} /> left)
                </Button>
              )}
            </SurveyCards>
          </HubSection>
        )}

        <HubSection
          title="Your feedback"
          subtitle="How this information will be used"
          tooltip="Information is voluntarily submitted and only retained for report building, UI/UX improvement, or feedback purposes. Information is aggregated. Information about your experience is utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
        >
          <SurveyCards>
            <FeedbackRow />
          </SurveyCards>
        </HubSection>

        <HubSection
          title="Manage delegates"
          tooltip={`Delegates can only access and submit Setup surveys on your behalf. Contact and experience data remains private. Up to ${plural({ value: MAX_DELEGATES, variants: ['delegate', 'delegates'], showValue: true })} allowed.`}
        >
          <SurveyCards>
            <CountRow
              title="Delegates"
              count={data?.delegates.items.length}
              href={PATH.SURVEYS_DELEGATES}
            />
          </SurveyCards>
        </HubSection>

        {delegatedOperators.length > 0 && (
          <HubSection
            title="Delegated operators"
            tooltip="You have been added as a delegate for these node operators. You can manage their setup surveys."
          >
            <SurveyCards>
              <CountRow
                title="Operators"
                count={delegatedOperators.length}
                href={PATH.SURVEYS_DELEGATOR}
              />
            </SurveyCards>
          </HubSection>
        )}

        {showErase && (
          <Button variant="error" fullWidth onClick={handleErase}>
            Erase all data from the database
          </Button>
        )}
      </Stack>
    </WhenLoaded>
  );
};
