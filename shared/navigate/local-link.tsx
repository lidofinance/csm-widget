import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, PropsWithChildren, useCallback } from 'react';

import { config } from 'config';
import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { LinkIpfs } from 'shared/components/link-ipfs';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { useCorrectPath } from './use-correct-path';

type LocalLinkProps = Omit<LinkProps, 'href'> & {
  href?: PATH;
  anchor?: `#${string}`;
};

export const LocalLink: FC<
  PropsWithChildren<WithMatomoEvent<LocalLinkProps>>
> = ({ matomoEvent, href: path, anchor, onClick, ...restProps }) => {
  const router = useRouter();
  const { ref, embed, app, theme } = router.query;

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

  const extraQuery = {} as Record<string, string>;
  // Not support case: ?ref=01234&ref=56789
  if (ref && typeof ref === 'string') extraQuery.ref = ref;
  if (embed && typeof embed === 'string') extraQuery.embed = embed;
  if (app && typeof app === 'string') extraQuery.app = app;
  if (theme && typeof theme === 'string') extraQuery.theme = theme;

  if (typeof href === 'string') {
    if (config.ipfsMode) {
      return <LinkIpfs {...restProps} href={href} query={extraQuery} />;
    }

    return (
      <Link
        {...restProps}
        href={{ pathname: href, query: extraQuery, hash: anchor }}
        passHref
        legacyBehavior
      >
        {/* TODO: fix when go to Next v13+ */}
        {/* see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component */}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <a {...restProps} onClick={onClickHandler} />
      </Link>
    );
  }

  throw new Error('Prop href is not compatible');
};
