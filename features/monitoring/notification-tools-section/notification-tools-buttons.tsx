import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { ComponentProps } from 'react';
import { ExternalButtonLink } from 'shared/components';
import { ReactComponent as CsmIcon } from 'assets/icons/csm.svg';

export const NOTIFICATION_TOOLS_BUTTONS: ComponentProps<
  typeof ExternalButtonLink
>[] = [
  {
    title: 'CSM Sentinel',
    icon: <CsmIcon />,
    href: 'https://github.com/skhomuti/csm-sentinel',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.dashboardNotificationSentinelLink,
    children: 'Provides your CSM Node Operator events to the telegram chats',
  },
];
