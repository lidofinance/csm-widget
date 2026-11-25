import { ReactNode } from 'react';
import { Crumb } from './types';
import { useDefaultCrumbs } from './use-default-crumbs';

// `dummy` is constant for a mounted page (prop + provider presence); dummy pages sit outside the operator providers that nav items need
export const useCrumbs = (
  dummy: boolean | 'semi' | undefined,
  title: ReactNode,
  breadcrumbs?: Crumb[],
): Crumb[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const derived = dummy ? [] : useDefaultCrumbs(title);
  if (breadcrumbs) return breadcrumbs;
  return derived;
};
