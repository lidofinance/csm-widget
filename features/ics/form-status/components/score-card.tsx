import {
  Button,
  Card,
  IconCheck,
  IconCross,
  SectionTitle,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@lidofinance/lido-app-ui';
import {
  IcsResponseDto,
  SCORE_SOURCES,
  TOTAL_SCORE_REQUIRED,
} from 'features/ics/shared';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import { calculateScores, isMinScoresReached } from '../utils';
import { CategoryCell, ScoreIconStyle } from '../styles';

type Props = Pick<IcsResponseDto, 'scores'> & {
  onView: () => void;
};

type Row = {
  id: string;
  title: string;
  required: number;
  value: number;
  passed: boolean;
};

export const ScoreCard: FC<Props> = ({ scores, onView }) => {
  const total = calculateScores(scores);

  const rows: Row[] = [
    ...SCORE_SOURCES.map(({ id, title, min }) => {
      const value = calculateScores(scores, id);
      return { id, title, required: min, value, passed: value >= min };
    }),
    {
      id: 'total',
      title: 'Total score',
      required: TOTAL_SCORE_REQUIRED,
      value: total,
      passed: total >= TOTAL_SCORE_REQUIRED && isMinScoresReached(scores),
    },
  ];

  return (
    <Card dataTestId={{ root: 'scorePointsSection' }}>
      <StretchStack gap={16}>
        <SectionTitle title="Your score" />
        <TableRoot variant="dense">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell align="right">Required</TableHeaderCell>
              <TableHeaderCell align="right">Your score</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ id, title, required, value, passed }) => (
              <TableRow
                key={id}
                data-testid={id === 'total' ? 'totalScoreBreakdown' : undefined}
              >
                <TableCell>
                  <CategoryCell>
                    <ScoreIconStyle $passed={passed}>
                      {passed ? <IconCheck /> : <IconCross />}
                    </ScoreIconStyle>
                    {title}
                  </CategoryCell>
                </TableCell>
                <TableCell align="right">{required}</TableCell>
                <TableCell align="right" data-testid="points">
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
        <div>
          <Button variant="outline" onClick={onView}>
            View breakdown
          </Button>
        </div>
      </StretchStack>
    </Card>
  );
};
