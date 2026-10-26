import { useInpageNavigation } from 'providers/inpage-navigation';
import { ComponentProps, FC, MouseEvent, useCallback } from 'react';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { ArrowIcon, ExternalIcon, LinkStyled } from './styles';

type LinkIconProps = {
  icon?: 'arrow' | 'external';
};

export const MatomoLink: FC<
  WithMatomoEvent<ComponentProps<typeof LinkStyled> & LinkIconProps>
> = ({ matomoEvent, onClick, icon, href, ...props }) => {
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
    <LinkStyled
      {...props}
      href={href}
      onClick={onClickHandler}
      icon={
        icon === 'arrow' ? (
          <ArrowIcon />
        ) : icon === 'external' ? (
          <ExternalIcon />
        ) : undefined
      }
    />
  );
};
