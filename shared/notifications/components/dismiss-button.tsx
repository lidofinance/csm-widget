import { Button } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ALERT_DEFINITIONS } from '../definitions';
import type { Alert } from '../types';
import { useNotifications } from '../use-notifications';

export const DismissButton: FC<{ alert: Alert }> = ({ alert }) => {
  const def = ALERT_DEFINITIONS[alert.type];
  const { acknowledge } = useNotifications();

  if (!def.ackUntil) return null;

  return (
    <Button
      size="small"
      variant="outline"
      onClick={() => {
        def.onDismissTrack?.();
        acknowledge(alert);
      }}
    >
      {def.dismissLabel ?? 'Dismiss'}
    </Button>
  );
};
