import { FC } from 'react';
import { Button, Text } from '@lidofinance/lido-ui';
import type { RejectedDkgFile } from '../types';

export const DkgRejectedFiles: FC<{
  rejected: RejectedDkgFile[];
  onDismiss: () => void;
}> = ({ rejected, onDismiss }) => {
  if (rejected.length === 0) return null;
  return (
    <div role="alert">
      <Text size="xs" color="error">
        {rejected.length} file(s) were not uploaded:
      </Text>
      <ul>
        {rejected.map((r) => (
          <li key={r.name}>
            <Text size="xs" color="error">
              {r.name} — {r.reason}
            </Text>
          </li>
        ))}
      </ul>
      <Button size="xs" variant="text" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  );
};
