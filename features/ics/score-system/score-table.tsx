import { IconChevronRight, Table } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { SCORE_SOURCES, ScoreSource, TOTAL_SCORE_REQUIRED } from '../shared';
import { Points } from './points';
import s from './score-table.module.css';

type Props = {
  onViewCriteria: (category: ScoreSource) => void;
};

type Row = {
  id: string;
  title: string;
  min: number;
  max: number;
  category?: ScoreSource;
};

const ROWS: Row[] = [
  ...SCORE_SOURCES.map((category) => ({
    id: category.id,
    title: category.title,
    min: category.min,
    max: category.max,
    category,
  })),
  {
    id: 'total',
    title: 'Total score required',
    min: TOTAL_SCORE_REQUIRED,
    max: SCORE_SOURCES.reduce((sum, { max }) => sum + max, 0),
  },
];

export const ScoreTable: FC<Props> = ({ onViewCriteria }) => (
  <Table<Row>
    rows={ROWS}
    rowKey={({ id }) => id}
    dataTestId={{ root: 'scoreTable' }}
    columns={[
      {
        key: 'category',
        header: 'Category',
        render: ({ title, category }) => (
          <div className={s.category}>
            <span className={s.strong}>{title}</span>
            {category && (
              <button
                className={s.criteriaButton}
                type="button"
                onClick={() => onViewCriteria(category)}
              >
                View criteria
                <IconChevronRight aria-hidden />
              </button>
            )}
          </div>
        ),
      },
      {
        key: 'max',
        header: 'Maximum',
        align: 'right',
        render: ({ max }) => (
          <span className={s.max}>
            <Points value={max} />
          </span>
        ),
      },
      {
        key: 'min',
        header: 'Minimum',
        align: 'right',
        render: ({ min }) => (
          <span className={s.strong}>
            <Points value={min} />
          </span>
        ),
      },
    ]}
  />
);
