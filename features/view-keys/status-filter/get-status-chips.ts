import type { TagVariant } from '@lidofinance/lido-app-ui';
import type {
  KeysBreakdownCounts,
  KeysBreakdownGroup,
} from 'utils/keys-breakdown';

export type StatusChipId = KeysBreakdownGroup;

export type StatusChip = {
  id: StatusChipId;
  label: string;
  variant: TagVariant;
  count: number;
};

type ChipDef = Omit<StatusChip, 'count'> & { csmFamilyOnly?: boolean };

const CHIPS: ChipDef[] = [
  { id: 'active', label: 'Active', variant: 'success' },
  { id: 'depositable', label: 'Depositable', variant: 'warning' },
  { id: 'activationPending', label: 'Pending activation', variant: 'warning' },
  { id: 'duplicated', label: 'Duplicated', variant: 'error' },
  {
    id: 'withStrikes',
    label: 'With strikes',
    variant: 'error',
    csmFamilyOnly: true,
  },
  { id: 'invalid', label: 'Invalid signature', variant: 'error' },
  { id: 'unbonded', label: 'Unbonded', variant: 'error' },
  { id: 'exited', label: 'Exited', variant: 'neutral' },
  { id: 'withdrawn', label: 'Withdrawn', variant: 'neutral' },
  { id: 'exitRequested', label: 'Exit requested', variant: 'warning' },
  {
    id: 'nonQueued',
    label: 'Non queued',
    variant: 'warning',
    csmFamilyOnly: true,
  },
  { id: 'unchecked', label: 'Unchecked', variant: 'warning' },
];

export const getStatusChips = (
  counts: KeysBreakdownCounts,
  { isCsmFamily }: { isCsmFamily: boolean },
): StatusChip[] =>
  CHIPS.filter(({ csmFamilyOnly }) => isCsmFamily || !csmFamilyOnly).map(
    ({ id, label, variant }) => ({ id, label, variant, count: counts[id] }),
  );

export const resolveStatusFilter = (
  value: unknown,
  chips: StatusChip[],
): StatusChipId | undefined => chips.find(({ id }) => id === value)?.id;
