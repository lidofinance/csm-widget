import { FC } from 'react';
import { Plural, SquaredChip } from 'shared/components';
import { Alert, Check } from './styles';

type Props = { issues?: number; 'data-testid'?: string };

export const IssuesChip: FC<Props> = ({
  issues,
  'data-testid': testId = 'issuesChip',
}) => {
  if (issues === undefined) return null;

  return (
    <SquaredChip
      variant={issues > 0 ? 'error' : 'success'}
      data-testid={testId}
    >
      {issues > 0 ? (
        <>
          <Alert />
          <Plural value={issues} variants={['issue', 'issues']} showValue />
        </>
      ) : (
        <>
          <Check />
          No issues
        </>
      )}
    </SquaredChip>
  );
};
