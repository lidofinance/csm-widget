import { Typography, type StatCardMetaItem } from '@lidofinance/lido-app-ui';
import type { KeysStatusItem } from '../utils/get-keys-status-items';

export const toKeysMetaItems = (items: KeysStatusItem[]): StatCardMetaItem[] =>
  items.map(({ label, count, tone, testid }) => ({
    label: (
      <Typography as="span" color={tone}>
        {label}
      </Typography>
    ),
    value: (
      <Typography as="span" color={tone} data-testid={testid}>
        {count}
      </Typography>
    ),
  }));
