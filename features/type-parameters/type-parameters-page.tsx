import { FC } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { TypeParameters } from './type-parameters';

export const TypeParametersPage: FC = () => (
  <Layout
    title="Operator Type Parameters"
    subtitle="Compare parameters"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs}
  >
    <TypePageSwitcher />
    <TypeParameters />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
