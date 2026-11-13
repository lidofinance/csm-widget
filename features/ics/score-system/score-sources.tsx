import { Body, Card, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC, useState } from 'react';
import { ScoreSource } from '../shared';
import { CriteriaModal } from './criteria-modal';
import { ScoreTable } from './score-table';

export const ScoreSources: FC = () => {
  const [category, setCategory] = useState<ScoreSource>();

  return (
    <Card dataTestId={{ root: 'scoreSystem' }}>
      <Stack direction="column" gap={24} align="stretch">
        <Stack direction="column" gap={4}>
          <SectionTitle title="Score system" />
          <Body color="secondary">
            The scoring system creates a clear path for independent stakers to
            qualify as “Identified Community” operators. Your score determines
            eligibility for the Identified Community Stakers List. Points are
            awarded by submitting verifiable proofs; - across categories such as
            experience, on-chain engagement, and community contributions - that
            demonstrate your qualifications. To be included in the list,
            applicants must obtain a sufficient score in each category below as
            well as an overall score across all the categories.
          </Body>
        </Stack>
        <ScoreTable onViewCriteria={setCategory} />
      </Stack>
      {category && (
        <CriteriaModal
          category={category}
          onClose={() => setCategory(undefined)}
        />
      )}
    </Card>
  );
};
