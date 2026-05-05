import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { BackButton, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { ClaimType } from './claim-type';
import { TypePageSwitcher } from 'shared/navigate';
import { PATH } from 'consts/urls';

// FIXME: show back-button only if flags.ICS_APPLY_ENABLED
export const ClaimTypePage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="ClaimType"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <TypePageSwitcher />
    <ClaimType />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
