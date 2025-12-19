import { Plus, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Plural, Stack, WhenLoaded } from 'shared/components';
import { formatDaysAgo } from 'utils';
import { SurveyItem, SurveyLink, SurveySection, Warning } from '../components';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { SetupRaw, SetupsKeys } from '../types';

type DelegatorSetupsProps = {
  operatorId: string;
};

export const DelegatorSetups: FC<DelegatorSetupsProps> = ({ operatorId }) => {
  const { data, isLoading } = useSurveysSWR<SetupRaw[]>('setups', {
    operatorId,
  });
  const { data: keys } = useSurveysSWR<SetupsKeys>('setups/keys', {
    operatorId,
  });

  const showSetups = !!(keys && (keys.total > 0 || keys.filled > 0));

  return (
    <WhenLoaded loading={!data && isLoading}>
      <SurveySection
        title={`Setups for ${operatorId}`}
        subtitle="How this information will be used"
        help="Information is voluntarily submitted and only retained for report building. Information is aggregated and utilized in the compilation of the Validator and Node Operator Metrics (VaNOM) reports"
      >
        {!showSetups ? (
          <Text size="sm" color="secondary">
            No keys available for this operator.
          </Text>
        ) : (
          <>
            {keys && keys.filled > keys.total && (
              <Warning>
                The number of keys has decreased. Please update the data
              </Warning>
            )}
            {data?.map((setup) => (
              <SurveyItem
                key={setup.index}
                title={
                  <Stack direction="column" gap="xs">
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
                    <Text as="span" size="xxs" color="secondary">
                      Updated {formatDaysAgo(setup.updatedAt)}
                    </Text>
                  </Stack>
                }
              >
                <SurveyLink
                  path={`${PATH.SURVEYS_DELEGATOR}/${operatorId}/${setup.index}`}
                >
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
                path={`${PATH.SURVEYS_DELEGATOR}/${operatorId}/new`}
              >
                <>
                  Add new setup
                  <>
                    {' '}
                    ({keys.left}{' '}
                    <Plural value={keys.left} variants={['key', 'keys']} />{' '}
                    left)
                  </>
                </>
              </SurveyLink>
            )}
          </>
        )}
      </SurveySection>
    </WhenLoaded>
  );
};
