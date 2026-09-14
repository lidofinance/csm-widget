import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Block, Stack, StepTrack } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypeCard } from './operator-type-cards/type-card';
import { TypesDocsNote } from './operator-type-cards/types-docs-note';
import { useVisibleTypes } from './operator-type-cards/use-visible-types';

export const SelectTypePage: FC = () => {
  const types = useVisibleTypes();
  const hasSteps = types.length > 1;

  return (
    <Layout
      title="Create a Node Operator"
      subtitle="Choose the operator type to create"
      pageName="SelectOperatorType"
    >
      <Block>
        <Stack direction="column" gap="xxl">
          <Stack direction="column" gap="sm">
            {hasSteps && <StepTrack current={1} length={2} />}
            <Text as="h3" size="lg" weight={700}>
              Choose operator type
            </Text>
            <TypesDocsNote />
          </Stack>
          <Stack direction="column" gap="xl">
            {types.map((type) => (
              <TypeCard key={type.type} type={type} />
            ))}
          </Stack>
        </Stack>
      </Block>
    </Layout>
  );
};
