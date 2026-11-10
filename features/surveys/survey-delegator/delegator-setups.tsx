import { Button, EmptyState, MessageBox } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Plural, WhenLoaded } from 'shared/components';
import { HubSection } from 'shared/components/hub-list';
import { SetupRow } from '../surveys-home/setup-row';
import { SurveyCards } from '../components';
import {
  callSurvey,
  parseOperatorKey,
  surveyRequest,
  useOperatorSurvey,
} from 'modules/surveys-sdk';
import { setupFindAll } from 'modules/surveys-sdk/generated';
import { SetupRaw } from '../types';
import { useSetupsKeys } from '../survey-setup/use-setups-keys';

type DelegatorSetupsProps = {
  operatorId: string;
};

export const DelegatorSetups: FC<DelegatorSetupsProps> = ({ operatorId }) => {
  const operatorKey = parseOperatorKey(operatorId) ?? undefined;

  const { data, isLoading } = useOperatorSurvey<SetupRaw[]>('setups', {
    operatorKey,
    get: ({ nodeOperatorId, token, signal }) =>
      callSurvey(() =>
        setupFindAll({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId },
        }),
      ),
  });
  const { data: keys } = useSetupsKeys(operatorKey);

  const showSetups = !!(keys && (keys.total > 0 || keys.filled > 0));

  return (
    <WhenLoaded loading={!data && isLoading}>
      <HubSection
        title={`Setups for ${operatorId}`}
        tooltip="Information is voluntarily submitted and only retained for report building. Information is aggregated and utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports."
      >
        {!showSetups ? (
          <EmptyState title="No keys available for this operator" />
        ) : (
          <>
            {keys && keys.filled > keys.total && (
              <MessageBox variant="warning">
                The number of keys has decreased. Please update the data.
              </MessageBox>
            )}
            <SurveyCards>
              {data?.map((setup) => (
                <SetupRow
                  key={setup.index}
                  setup={setup}
                  operatorKey={operatorKey}
                  editHref={`${PATH.SURVEYS_DELEGATOR}/${operatorId}/${setup.index}`}
                />
              ))}
              {keys && keys.left > 0 && (
                <Button
                  variant="outline"
                  fullWidth
                  href={`${PATH.SURVEYS_DELEGATOR}/${operatorId}/new`}
                >
                  Add new setup ({keys.left}{' '}
                  <Plural value={keys.left} variants={['key', 'keys']} /> left)
                </Button>
              )}
            </SurveyCards>
          </>
        )}
      </HubSection>
    </WhenLoaded>
  );
};
