import { Breadcrumbs } from '@lidofinance/lido-app-ui';
import { useRouter } from 'next/router';
import { FC, MouseEvent, useMemo } from 'react';
import { useCorrectPath } from 'shared/navigate';
import { useForwardedQuery } from 'shared/navigate/use-forwarded-query';
import { Crumb } from './types';

type Props = { crumbs: Crumb[]; className?: string };

export const Crumbs: FC<Props> = ({ crumbs, className }) => {
  const correct = useCorrectPath();
  const router = useRouter();
  const query = useForwardedQuery();

  const items = useMemo(() => {
    const search = new URLSearchParams(query).toString();
    return crumbs.map(({ label, href }) => {
      if (!href) return { label };
      const pathname = correct(href);
      return {
        label,
        href: search ? `${pathname}?${search}` : pathname,
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          void router.push({ pathname, query });
        },
      };
    });
  }, [crumbs, correct, router, query]);

  if (items.length === 0) return null;
  return <Breadcrumbs items={items} className={className} />;
};
