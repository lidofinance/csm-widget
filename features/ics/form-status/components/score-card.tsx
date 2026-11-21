import {
  Button,
  Card,
  IconCheck,
  IconCross,
  SectionTitle,
  Stack,
  Table,
  TableColumn,
} from '@lidofinance/lido-app-ui';
import {
  IcsResponseDto,
  SCORE_SOURCES,
  TOTAL_SCORE_REQUIRED,
} from 'features/ics/shared';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import { calculateScores, isMinScoresReached } from '../utils';
import s from '../styles.module.css';

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

const getRowKey = ({ id }: Row) => id;
const getRowProps = ({ id }: Row) => ({
  dataTestId: { root: id === 'total' ? 'totalScoreBreakdown' : undefined },
});

const COLUMNS: TableColumn<Row>[] = [
  {
    key: 'title',
    header: 'Category',
    render: ({ title, passed }) => (
      <Stack direction="row" align="center" gap={8}>
        <span className={s.scoreIcon} data-passed={passed || undefined}>
          {passed ? <IconCheck /> : <IconCross />}
        </span>
        {title}
      </Stack>
    ),
  },
  { key: 'required', header: 'Required', align: 'right' },
  {
    key: 'value',
    header: 'Your score',
    align: 'right',
    render: ({ value }) => <span data-testid="points">{value}</span>,
  },
];

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
        <Table
          variant="dense"
          columns={COLUMNS}
          rows={rows}
          rowKey={getRowKey}
          getRowProps={getRowProps}
        />
        <div>
          <Button variant="outline" onClick={onView}>
            View breakdown
          </Button>
        </div>
      </StretchStack>
    </Card>
  );
};
