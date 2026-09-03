import { FC } from 'react';
import { Block, ExtraWidth, Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import { CardsGrid } from './operator-type-cards/styles';
import { TypeCard } from './operator-type-cards/type-card';
import { TypesDocsNote } from './operator-type-cards/types-docs-note';
import { useVisibleTypes } from './operator-type-cards/use-visible-types';

export const SelectTypePage: FC = () => {
  const types = useVisibleTypes();

  return (
    <Layout
      title="Create a Node Operator"
      subtitle="Choose the operator type to create"
      pageName="SelectOperatorType"
    >
      <ExtraWidth>
        <Block>
          <Stack direction="column" gap="lg">
            <TypesDocsNote />
            <CardsGrid>
              {types.map((type) => (
                <TypeCard key={type.type} type={type} />
              ))}
            </CardsGrid>
          </Stack>
        </Block>
      </ExtraWidth>
    </Layout>
  );
};
