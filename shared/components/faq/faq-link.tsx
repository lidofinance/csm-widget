import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { ComponentProps, FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

type FaqLinkProps = Omit<ComponentProps<typeof MatomoLink>, 'matomoEvent'> & {
  href: string;
};

export const FaqLink: FC<FaqLinkProps> = (props) => (
  <MatomoLink {...props} matomoEvent={MATOMO_CLICK_EVENTS_TYPES.faqItemLink} />
);
