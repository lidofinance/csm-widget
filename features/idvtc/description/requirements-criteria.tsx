import { Body, Card, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { CRITERIA } from './criteria-data';
import s from './styles.module.css';

export const RequirementsCriteria: FC = () => (
  <Card dataTestId={{ root: 'idvtcRequirements' }}>
    <Stack direction="column" gap={24}>
      <SectionTitle
        title="Requirements and Criteria"
        subtitle="To be included in the list, applicants must meet all the criteria and be approved by the CSM Committee"
      />
      {CRITERIA.map(({ id, title, content }) => (
        <section key={id} className={s.criterion}>
          <Body weight="semibold">{title}</Body>
          <div className={s.content}>{content}</div>
        </section>
      ))}
    </Stack>
  </Card>
);
