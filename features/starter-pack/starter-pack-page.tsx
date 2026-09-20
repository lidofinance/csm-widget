import { WIDGET_TITLE } from 'consts';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { InvitesRedirect } from './invites-redirect';
import { StarterPack } from './starter-pack';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const StarterPackPage: FC = () => {
  return (
    <Layout title={WIDGET_TITLE} pageName="StarterPack">
      <InvitesRedirect />
      <StarterPack />
      <Faq items={useFaq('MAIN')} />
    </Layout>
  );
};
