import { Body, Card, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { CRITERIA } from './criteria-data';
import { CriteriaContent, CriterionStyle } from './styles';

export const RequirementsCriteria: FC = () => (
  <Card dataTestId={{ root: 'idvtcRequirements' }}>
    <Stack direction="column" gap={24}>
      <SectionTitle
        title="Requirements and Criteria"
        subtitle="To be included in the list, applicants must meet all the criteria and be approved by the CSM Committee"
      />
      {CRITERIA.map(({ id, title, content }) => (
        <CriterionStyle key={id}>
          <Body weight="semibold">{title}</Body>
          <CriteriaContent>{content}</CriteriaContent>
        </CriterionStyle>
      ))}
    </Stack>
  </Card>
);
