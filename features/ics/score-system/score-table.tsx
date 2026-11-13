import { IconChevronRight, Table } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { SCORE_SOURCES, ScoreSource, TOTAL_SCORE_REQUIRED } from '../shared';
import { Points } from './points';

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

const MaxStyle = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
`;

const CategoryStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const CriteriaButtonStyle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--lido-app-ui-color-text-active);
  font: inherit;
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;

  &:hover {
    color: var(--lido-app-ui-color-text-active-hover);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const StrongStyle = styled.span`
  font-weight: 600;
`;

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
          <CategoryStyle>
            <StrongStyle>{title}</StrongStyle>
            {category && (
              <CriteriaButtonStyle
                type="button"
                onClick={() => onViewCriteria(category)}
              >
                View criteria
                <IconChevronRight aria-hidden />
              </CriteriaButtonStyle>
            )}
          </CategoryStyle>
        ),
      },
      {
        key: 'max',
        header: 'Maximum',
        align: 'right',
        render: ({ max }) => (
          <MaxStyle>
            <Points value={max} />
          </MaxStyle>
        ),
      },
      {
        key: 'min',
        header: 'Minimum',
        align: 'right',
        render: ({ min }) => (
          <StrongStyle>
            <Points value={min} />
          </StrongStyle>
        ),
      },
    ]}
  />
);
