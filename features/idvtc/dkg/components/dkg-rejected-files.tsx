import { FC } from 'react';
import { Body, Button, MessageBox } from '@lidofinance/lido-app-ui';
import type { RejectedDkgFile } from '../types';

export const DkgRejectedFiles: FC<{
  rejected: RejectedDkgFile[];
  onDismiss: () => void;
}> = ({ rejected, onDismiss }) => {
  if (rejected.length === 0) return null;
  return (
    <MessageBox
      variant="error"
      icon
      role="alert"
      headline={`${rejected.length} file(s) were not uploaded`}
    >
      <ul>
        {rejected.map((r, i) => (
          <li key={`${r.name}-${i}`}>
            <Body color="error">
              {r.name} — {r.reason}
            </Body>
          </li>
        ))}
      </ul>
      <Button size="small" variant="outline" type="button" onClick={onDismiss}>
        Dismiss
      </Button>
    </MessageBox>
  );
};
