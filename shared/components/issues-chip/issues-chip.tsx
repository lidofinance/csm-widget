import { FC } from 'react';
import { Plural, SquaredChip } from 'shared/components';
import { Alert, Check, Info } from './styles';

type Props = {
  issues?: number;
  unavailable?: boolean;
  'data-testid'?: string;
};

export const IssuesChip: FC<Props> = ({
  issues,
  unavailable,
  'data-testid': testId = 'issuesChip',
}) => {
  if (unavailable) {
    return (
      <SquaredChip variant="secondary" data-testid={testId}>
        <Info />
        Status unavailable
      </SquaredChip>
    );
  }

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
