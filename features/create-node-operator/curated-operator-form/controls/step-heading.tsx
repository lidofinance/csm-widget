import { Description, H2 } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { getStepHeading } from '../curated-operator-wizard';
import { HeadingStyle } from './styles';

export const CuratedOperatorStepHeading: FC<{ step: number }> = ({ step }) => {
  const { title, description, note } = getStepHeading(step);

  return (
    <HeadingStyle>
      <H2 as="h1" dataTestId={{ root: 'stepTitle' }}>
        {title}
      </H2>
      {description && (
        <Description as="p" dataTestId={{ root: 'stepDescription' }}>
          {description}
        </Description>
      )}
      {note && <Description as="p">{note}</Description>}
    </HeadingStyle>
  );
};
