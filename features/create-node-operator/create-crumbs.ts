import { PATH } from 'consts/urls';
import type { Crumb } from 'shared/layout/crumbs';

export const CREATE_CRUMBS: Crumb[] = [
  { label: 'Validate with Lido', href: PATH.HOME },
  { label: 'Community Staking', href: PATH.CSM },
  { label: 'New operator' },
];
