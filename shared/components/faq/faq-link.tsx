import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, ReactNode } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

type FaqLinkProps = {
  href: string;
  children: ReactNode;
};

export const FaqLink: FC<FaqLinkProps> = ({ href, children }) => {
  return (
    <MatomoLink href={href} matomoEvent={MATOMO_CLICK_EVENTS_TYPES.faqItemLink}>
      {children}
    </MatomoLink>
  );
};
