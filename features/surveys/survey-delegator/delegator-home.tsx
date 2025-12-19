import { Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Stack, WhenLoaded } from 'shared/components';
import { SurveyItem, SurveyLink, SurveySection } from '../components';
import { useSurveyContext } from '../surveys-provider';

export const DelegatorHome: FC = () => {
  const { delegatedOperators, isLoading } = useSurveyContext();

  return (
    <WhenLoaded loading={isLoading}>
      <SurveySection
        title="Delegated operators"
        subtitle="How delegation works"
        help="As a delegate, you can access and submit Setup surveys on behalf of node operators who have added you as their delegate."
      >
        {delegatedOperators?.length === 0 ? (
          <Text size="sm" color="secondary">
            You are not a delegate for any node operator yet.
          </Text>
        ) : (
          <Stack direction="column" gap="md">
            {delegatedOperators?.map((operatorId) => (
              <SurveyItem
                key={operatorId}
                title={`Node Operator ${operatorId}`}
              >
                <SurveyLink path={`${PATH.SURVEYS_DELEGATOR}/${operatorId}`}>
                  Manage setups
                </SurveyLink>
              </SurveyItem>
            ))}
          </Stack>
        )}
      </SurveySection>
    </WhenLoaded>
  );
};
