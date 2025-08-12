import { FC } from 'react';
import { ApplicationFlow } from './score-system/application-flow';
import { Introduction } from './score-system/introduction';
import { ScoreSources } from './score-system/score-sources';
import { BlockStyle } from './score-system/styles';

export const IcsScores: FC = () => {
  return (
    <BlockStyle>
      <Introduction />
      <ScoreSources />
      <ApplicationFlow />
    </BlockStyle>
  );
};
