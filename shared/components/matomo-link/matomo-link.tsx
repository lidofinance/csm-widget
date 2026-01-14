import Link from 'next/link';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { ComponentProps, FC, PropsWithChildren, useCallback } from 'react';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { LinkStyled } from './styles';
import { ArrowIcon, ExternalIcon } from './styles';

type LinkIconProps = {
  icon?: 'arrow' | 'external';
};

export const MatomoLink: FC<
  PropsWithChildren<
    WithMatomoEvent<ComponentProps<typeof LinkStyled> & LinkIconProps>
  >
> = ({ matomoEvent, onClick, icon, children, ...props }) => {
  const { navigateInpageAnchor } = useInpageNavigation();

  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      trackMatomoEvent(matomoEvent);
      props.href?.startsWith('#') && navigateInpageAnchor(event);
      event?.stopPropagation();
      onClick?.(event);
    },
    [matomoEvent, navigateInpageAnchor, onClick, props.href],
  );

  const IconComponent =
    icon === 'arrow' ? (
      <ArrowIcon />
    ) : icon === 'external' ? (
      <ExternalIcon />
    ) : null;

  return (
    <Link href={props.href || ''} passHref legacyBehavior>
      {/* TODO: fix when go to Next v13+ */}
      {/* see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <LinkStyled {...props} onClick={onClickHandler}>
        {children}
        {IconComponent}
      </LinkStyled>
    </Link>
  );
};
