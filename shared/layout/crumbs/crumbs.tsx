import { Breadcrumbs } from '@lidofinance/lido-app-ui';
import { FC, useMemo } from 'react';
import { useCorrectPath } from 'shared/navigate';
import { Crumb } from './types';

type Props = { crumbs: Crumb[]; className?: string };

export const Crumbs: FC<Props> = ({ crumbs, className }) => {
  const correct = useCorrectPath();

  const items = useMemo(
    () =>
      crumbs.map(({ label, href }) =>
        href ? { label, href: correct(href) } : { label },
      ),
    [crumbs, correct],
  );

  if (items.length === 0) return null;
  return <Breadcrumbs items={items} className={className} />;
};
