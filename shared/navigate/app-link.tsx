import type { LinkComponentProps } from '@lidofinance/lido-app-ui';
import Link from 'next/link';
import { forwardRef, MouseEvent, useCallback, useMemo } from 'react';

import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { useCorrectPath } from './use-correct-path';
import { useForwardedQuery } from './use-forwarded-query';

const PATHS: string[] = Object.values(PATH);

export const AppLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ href, onClick, ...rest }, ref) => {
    const correct = useCorrectPath();
    const forwarded = useForwardedQuery();
    const { closeModal } = useModalActions();

    const target = useMemo(() => {
      const url = new URL(href, 'http://app.local');
      const pathname = PATHS.includes(url.pathname)
        ? correct(url.pathname as PATH)
        : url.pathname;
      return {
        pathname,
        query: { ...forwarded, ...Object.fromEntries(url.searchParams) },
        hash: url.hash,
      };
    }, [href, correct, forwarded]);

    const onClickHandler = useCallback(
      (event: MouseEvent<HTMLAnchorElement>) => {
        closeModal();
        onClick?.(event);
      },
      [closeModal, onClick],
    );

    return (
      <Link href={target} passHref legacyBehavior>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <a ref={ref} {...rest} onClick={onClickHandler} />
      </Link>
    );
  },
);
