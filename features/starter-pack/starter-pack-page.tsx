import { FC } from 'react';

import { isModuleCM } from 'consts';
import { FAQ_MAIN_CM, FAQ_MAIN_CSM } from 'faq';
import { Layout } from 'shared/layout';
import { InvitesRedirect } from './invites-redirect';
import { StarterPack } from './starter-pack';
import { Faq } from 'shared/components';

// Pre-operator landing: branch on the STATIC deploy module, not reactive useFaq.
export const StarterPackPage: FC = () => {
  return (
    <Layout title="Community Staking Module" pageName="StarterPack">
      <InvitesRedirect />
      <StarterPack />
      <Faq items={isModuleCM ? FAQ_MAIN_CM : FAQ_MAIN_CSM} />
    </Layout>
  );
};
