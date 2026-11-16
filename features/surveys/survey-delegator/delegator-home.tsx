import { Button, EmptyState } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { HubList, HubRow, HubSection } from 'shared/components/hub-list';
import { SurveyCards } from '../components';
import { useSurveyContext } from '../surveys-provider';

export const DelegatorHome: FC = () => {
  const { delegatedOperators, isLoading } = useSurveyContext();

  return (
    <WhenLoaded loading={isLoading}>
      <HubSection
        title="Delegated operators"
        tooltip="As a delegate, you can access and submit Setup surveys on behalf of node operators who have added you as their delegate"
      >
        {delegatedOperators?.length === 0 ? (
          <EmptyState title="You are not a delegate for any node operator yet" />
        ) : (
          <SurveyCards>
            {delegatedOperators?.map((operatorId) => (
              <HubList key={operatorId}>
                <HubRow
                  title={`Node Operator ${operatorId}`}
                  trailing={
                    <Button
                      variant="outline"
                      size="small"
                      href={`${PATH.SURVEYS_DELEGATOR}/${operatorId}`}
                    >
                      Manage setups
                    </Button>
                  }
                />
              </HubList>
            ))}
          </SurveyCards>
        )}
      </HubSection>
    </WhenLoaded>
  );
};
