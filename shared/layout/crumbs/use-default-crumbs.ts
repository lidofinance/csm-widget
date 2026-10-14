import { ReactNode } from 'react';
import { useRouterPath } from 'shared/hooks';
import { getPathWithoutQuery } from 'utils';
import { useNavItems } from '../navigation/use-nav-items';
import { Crumb } from './types';

const normalize = (path: string) =>
  getPathWithoutQuery(path.split('#')[0]) || '/';

export const useDefaultCrumbs = (title: ReactNode): Crumb[] => {
  const path = normalize(useRouterPath());
  const items = useNavItems();
  const titleLabel = typeof title === 'string' ? title : undefined;

  const own = items.find((item) => item.path === path);
  if (own) return [{ label: own.name }];

  const parent = items.find((item) => item.subPaths?.some((p) => p === path));
  if (parent) {
    return titleLabel
      ? [{ label: parent.name, href: parent.path }, { label: titleLabel }]
      : [{ label: parent.name }];
  }

  return titleLabel ? [{ label: titleLabel }] : [];
};
