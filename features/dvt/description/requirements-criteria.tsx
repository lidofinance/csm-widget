import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { CRITERIA } from './criteria-data';
import { CriteriaAccordionStyle, CriteriaContent } from './styles';

export const RequirementsCriteria: FC = () => {
  return (
    <Stack direction="column" gap="md">
      <Text as="h3" size="lg" weight="bold">
        Requirements and Criteria
      </Text>
      <Text size="xs" color="secondary">
        To be included in the list, applicants must meet all the criteria and be
        approved by the CSM Committee.
      </Text>
      {CRITERIA.map((criterion) => (
        <CriteriaAccordionStyle
          key={criterion.id}
          id={criterion.id}
          summary={
            <Text size="xs" weight={700}>
              {criterion.title}
            </Text>
          }
        >
          <CriteriaContent>{criterion.content}</CriteriaContent>
        </CriteriaAccordionStyle>
      ))}
    </Stack>
  );
};
