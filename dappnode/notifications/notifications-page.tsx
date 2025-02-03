import { FC } from 'react';
import { Faq } from 'shared/components';

import { NotificationsComponent } from './notifications-component';
import { Layout } from 'shared/layout';
import NotificationsTypes from './notifications-types';

export const NotificationsPage: FC = () => (
  <Layout
    title="Change Telegram Notifications"
    subtitle="Forward your notifications to your Telegram account"
  >
    <NotificationsComponent />
    <NotificationsTypes />
    <Faq />
  </Layout>
);
