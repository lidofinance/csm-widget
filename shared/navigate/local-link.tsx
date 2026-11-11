import { AnchorHTMLAttributes, FC, MouseEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import { PATH } from 'consts/urls';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { AppLink } from './app-link';

type LocalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href?: PATH;
  anchor?: `#${string}`;
  'data-testid'?: string;
  query?: Record<string, string>;
};

const currentQuery = (query: ParsedUrlQuery) => {
  const entries = Object.entries(query).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const LocalLink: FC<WithMatomoEvent<LocalLinkProps>> = ({
  matomoEvent,
  href: path,
  query,
  anchor,
  onClick,
  ...restProps
}) => {
  const router = useRouter();

  const target = path ?? router.pathname;
  const sameRoute = target === router.pathname;
  const params = query ?? (sameRoute ? currentQuery(router.query) : undefined);
  const search = params ? `?${new URLSearchParams(params)}` : '';
  const href = `${target}${search}${anchor ?? ''}`;

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      trackMatomoEvent(matomoEvent);
      event.stopPropagation();
      onClick?.(event);
    },
    [matomoEvent, onClick],
  );

  return <AppLink {...restProps} href={href} onClick={onClickHandler} />;
};
