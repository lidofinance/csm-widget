import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, {
  Children,
  cloneElement,
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useCallback,
} from 'react';

import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { useCorrectPath } from './use-correct-path';
import { useForwardedQuery } from './use-forwarded-query';

type LocalLinkProps = Omit<LinkProps, 'href'> & {
  href?: PATH;
  anchor?: `#${string}`;
  'data-testid'?: string;
  query?: Record<string, string>;
  title?: string;
  asChild?: boolean;
};

type LinkChild = ReactElement<{
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}>;

export const LocalLink: FC<
  PropsWithChildren<WithMatomoEvent<LocalLinkProps>>
> = ({
  matomoEvent,
  href: path,
  query,
  anchor,
  onClick,
  asChild,
  children,
  ...restProps
}) => {
  const router = useRouter();

  const href = useCorrectPath(path ?? (router.pathname as PATH));
  const { closeModal } = useModalActions();

  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      trackMatomoEvent(matomoEvent);
      closeModal();
      event.stopPropagation();
      onClick?.(event);
    },
    [closeModal, matomoEvent, onClick],
  );

  const extraQuery = useForwardedQuery(query);

  if (typeof href === 'string') {
    if (asChild) {
      const child = Children.only(children) as LinkChild;
      const { 'data-testid': testId, title } = restProps;

      return (
        <Link
          {...restProps}
          href={{ pathname: href, query: extraQuery, hash: anchor }}
          passHref
          legacyBehavior
        >
          {cloneElement(child, {
            ...(testId && { 'data-testid': testId }),
            ...(title && { title }),
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
              onClickHandler(event);
              child.props.onClick?.(event);
            },
          })}
        </Link>
      );
    }

    return (
      <Link
        {...restProps}
        href={{ pathname: href, query: extraQuery, hash: anchor }}
        onClick={onClickHandler}
      />
    );
  }

  throw new Error('Prop href is not compatible');
};
