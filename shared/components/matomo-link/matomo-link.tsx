import { LinkProps } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, useCallback } from 'react';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { LinkStyled } from './styles';

export const MatomoLink: FC<WithMatomoEvent<LinkProps>> = ({
  matomoEvent,
  onClick,
  ...props
}) => {
  const { navigateInpageAnchor } = useInpageNavigation();

  const onClickHandler = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackMatomoEvent(matomoEvent);
      props.href?.startsWith('#') && navigateInpageAnchor(e);
      onClick?.(e);
    },
    [matomoEvent, navigateInpageAnchor, onClick, props.href],
  );

  return (
    <Link href={props.href || ''} passHref legacyBehavior>
      {/* TODO: fix when go to Next v13+ */}
      {/* see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <LinkStyled {...props} onClick={onClickHandler} />
    </Link>
  );
};
