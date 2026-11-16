import { useInpageNavigation } from 'providers/inpage-navigation';
import { ComponentProps, FC, PropsWithChildren, useCallback } from 'react';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { ArrowIcon, ExternalIcon, LinkStyled } from './styles';

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
    <LinkStyled {...props} onClick={onClickHandler}>
      {children}
      {IconComponent}
    </LinkStyled>
  );
};
