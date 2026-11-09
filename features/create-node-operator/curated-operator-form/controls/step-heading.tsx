import { Description, H2, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { getStepHeading } from '../curated-operator-wizard';

export const CuratedOperatorStepHeading: FC<{ step: number }> = ({ step }) => {
  const { title, description, note } = getStepHeading(step);

  return (
    <Stack gap={8}>
      <H2 as="h1" dataTestId={{ root: 'stepTitle' }}>
        {title}
      </H2>
      {description && (
        <Description as="p" dataTestId={{ root: 'stepDescription' }}>
          {description}
        </Description>
      )}
      {note && <Description as="p">{note}</Description>}
    </Stack>
  );
};
