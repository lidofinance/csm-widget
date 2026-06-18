import { FC } from 'react';

import { Layout } from 'shared/layout';
import { InvitesRedirect } from './invites-redirect';
import { StarterPack } from './starter-pack';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const StarterPackPage: FC = () => {
  const { FAQ_MAIN } = useFaq();

  return (
    <Layout title="Community Staking Module" pageName="StarterPack">
      <InvitesRedirect />
      <StarterPack />
      <Faq items={FAQ_MAIN} />
    </Layout>
  );
};
