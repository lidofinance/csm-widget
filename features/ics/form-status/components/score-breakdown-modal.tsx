import {
  IcsResponseDto,
  SCORE_SOURCES,
  ScoreSource,
} from 'features/ics/shared';
import { Points } from 'features/ics/score-system/points';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import styled from 'styled-components';
import { WideModalStyle } from '../../styles';
import { calculateScores } from '../utils';

type Props = Pick<IcsResponseDto, 'scores'> & {
  onClose: () => void;
};

const HeadingStyle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: var(--lido-app-ui-font-size-body);
  line-height: var(--lido-app-ui-line-height-body);
  font-weight: 600;
  color: var(--lido-app-ui-color-text-default);
`;

const ItemsStyle = styled.ul`
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
`;

const ItemStyle = styled.li<{ $dimmed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: var(--lido-app-ui-font-size-body);
  line-height: var(--lido-app-ui-line-height-body);
  color: ${({ $dimmed }) =>
    $dimmed
      ? 'var(--lido-app-ui-color-text-tertiary)'
      : 'var(--lido-app-ui-color-text-default)'};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.6 : 1)};

  & + & {
    border-top: 1px solid var(--lido-app-ui-color-border-default);
  }
`;

const ItemNameStyle = styled.span`
  flex: 1;
  min-width: 0;
`;

const CategoryItems: FC<{
  source: ScoreSource;
  scores: IcsResponseDto['scores'];
}> = ({ source, scores }) => (
  <ItemsStyle>
    {source.items.map(({ id, name, icon }) => {
      const value = scores[id] ?? 0;
      return (
        <ItemStyle key={id} $dimmed={value === 0} data-testid="scoreItem">
          {icon}
          <ItemNameStyle data-testid="scoreLabel">{name}</ItemNameStyle>
          <span data-testid="scoreValue">
            <Points value={value} />
          </span>
        </ItemStyle>
      );
    })}
  </ItemsStyle>
);

export const ScoreBreakdownModal: FC<Props> = ({ scores, onClose }) => (
  <WideModalStyle
    withOverlay
    title="Score breakdown"
    onClose={onClose}
    dataTestId={{ root: 'scoreBreakdownModal' }}
  >
    <StretchStack gap={24}>
      <HeadingStyle data-testid="scoreBreakdownTotal">
        <span>Total score</span>
        <Points value={calculateScores(scores)} />
      </HeadingStyle>
      {SCORE_SOURCES.map((source) => (
        <section key={source.id} id={source.id}>
          <HeadingStyle>
            <span>{source.title}</span>
            <Points value={calculateScores(scores, source.id)} />
          </HeadingStyle>
          <CategoryItems source={source} scores={scores} />
        </section>
      ))}
    </StretchStack>
  </WideModalStyle>
);
