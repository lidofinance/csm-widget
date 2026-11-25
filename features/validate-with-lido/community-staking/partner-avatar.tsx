import { FC } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent } from 'utils';

export type PartnerAvatarProps = {
  name: string;
  src: string;
  href: string;
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES;
  className?: string;
};

export const PartnerAvatar: FC<PartnerAvatarProps> = ({
  name,
  src,
  href,
  matomoEvent,
  className,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={name}
    onClick={() => matomoEvent && trackMatomoEvent(matomoEvent)}
  >
    <img className={className} src={src} alt={name} title={name} />
  </a>
);
