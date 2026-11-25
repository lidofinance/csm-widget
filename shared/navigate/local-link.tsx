import { AnchorHTMLAttributes, FC, MouseEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import { PATH } from 'consts/urls';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { AppLink } from './app-link';
import { isInpageAnchor } from './is-inpage-anchor';

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
  const { navigateInpageAnchor } = useInpageNavigation();

  const target = path ?? router.pathname;
  const sameRoute = target === router.pathname;
  const params = query ?? (sameRoute ? currentQuery(router.query) : undefined);
  const search = params ? `?${new URLSearchParams(params)}` : '';
  const href = `${target}${search}${anchor ?? ''}`;
  const inpage = isInpageAnchor(sameRoute, anchor, query);

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      trackMatomoEvent(matomoEvent);
      event.stopPropagation();
      onClick?.(event);
      if (inpage && !event.defaultPrevented) navigateInpageAnchor(event);
    },
    [matomoEvent, onClick, inpage, navigateInpageAnchor],
  );

  return <AppLink {...restProps} href={href} onClick={onClickHandler} />;
};
