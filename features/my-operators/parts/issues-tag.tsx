import { IconCheck, IconWarning, Tag } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { plural } from 'utils/plural';

type Props = {
  count: number | undefined;
  dataTestId: string;
};

export const IssuesTag: FC<Props> = ({ count, dataTestId }) => {
  if (count === undefined) return null;

  return count > 0 ? (
    <Tag
      variant="error"
      icon={<IconWarning />}
      dataTestId={{ root: dataTestId }}
    >
      {plural({ value: count, variants: ['issue', 'issues'], showValue: true })}
    </Tag>
  ) : (
    <Tag
      variant="success"
      icon={<IconCheck />}
      dataTestId={{ root: dataTestId }}
    >
      No issues
    </Tag>
  );
};
