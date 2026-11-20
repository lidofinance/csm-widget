import { IconLink, TextLink, TextLinkProps } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, MouseEvent, ReactNode, useCallback } from 'react';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';

import Arrow from 'assets/icons/arrow-right.svg?react';

import s from './styles.module.css';

type AnchorLinkProps = Omit<
  Extract<TextLinkProps, { href: string }>,
  'href' | 'icon'
> & { href?: string };

type LinkIconProps = {
  icon?: ReactNode;
  $inline?: boolean;
  $secondary?: boolean;
};

export const MatomoLink: FC<
  WithMatomoEvent<AnchorLinkProps & LinkIconProps>
> = ({
  matomoEvent,
  onClick,
  icon,
  href,
  className,
  $inline,
  $secondary,
  ...props
}) => {
  const { navigateInpageAnchor } = useInpageNavigation();

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      trackMatomoEvent(matomoEvent);
      href?.startsWith('#') && navigateInpageAnchor(event);
      event.stopPropagation();
      onClick?.(event);
    },
    [matomoEvent, navigateInpageAnchor, onClick, href],
  );

  return (
    <TextLink
      {...props}
      className={cn(s.link, className)}
      data-inline={$inline || undefined}
      href={href as string}
      onClick={onClickHandler}
      size="inherit"
      variant={$secondary ? 'secondary' : 'primary'}
      icon={
        icon === 'arrow' ? (
          <Arrow className={s.arrowIcon} />
        ) : icon === 'external' ? (
          <IconLink className={s.externalIcon} />
        ) : undefined
      }
    />
  );
};
