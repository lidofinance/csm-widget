import { AnchorHTMLAttributes, FC, MouseEvent, useCallback } from 'react';
import { useRouter } from 'next/router';

import { PATH } from 'consts/urls';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { AppLink } from './app-link';

type LocalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href?: PATH;
  anchor?: `#${string}`;
  'data-testid'?: string;
  query?: Record<string, string>;
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

  const search = query ? `?${new URLSearchParams(query)}` : '';
  const href = `${path ?? router.pathname}${search}${anchor ?? ''}`;

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
