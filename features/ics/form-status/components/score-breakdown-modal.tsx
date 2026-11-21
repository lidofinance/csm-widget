import { Modal } from '@lidofinance/lido-app-ui';
import {
  IcsResponseDto,
  SCORE_SOURCES,
  ScoreSource,
} from 'features/ics/shared';
import { Points } from 'features/ics/score-system/points';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import { calculateScores } from '../utils';
import s from './score-breakdown-modal.module.css';

type Props = Pick<IcsResponseDto, 'scores'> & {
  onClose: () => void;
};

const CategoryItems: FC<{
  source: ScoreSource;
  scores: IcsResponseDto['scores'];
}> = ({ source, scores }) => (
  <ul className={s.items}>
    {source.items.map(({ id, name, icon }) => {
      const value = scores[id] ?? 0;
      return (
        <li
          key={id}
          className={s.item}
          data-dimmed={value === 0 || undefined}
          data-testid="scoreItem"
        >
          {icon}
          <span className={s.itemName} data-testid="scoreLabel">
            {name}
          </span>
          <span data-testid="scoreValue">
            <Points value={value} />
          </span>
        </li>
      );
    })}
  </ul>
);

export const ScoreBreakdownModal: FC<Props> = ({ scores, onClose }) => (
  <Modal
    size="large"
    withOverlay
    title="Score breakdown"
    onClose={onClose}
    dataTestId={{ root: 'scoreBreakdownModal' }}
  >
    <StretchStack gap={24}>
      <div className={s.heading} data-testid="scoreBreakdownTotal">
        <span>Total score</span>
        <Points value={calculateScores(scores)} />
      </div>
      {SCORE_SOURCES.map((source) => (
        <section key={source.id} id={source.id}>
          <div className={s.heading}>
            <span>{source.title}</span>
            <Points value={calculateScores(scores, source.id)} />
          </div>
          <CategoryItems source={source} scores={scores} />
        </section>
      ))}
    </StretchStack>
  </Modal>
);
