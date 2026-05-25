import { FC } from 'react';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { IcsProviders } from 'features/ics/shared';
import { BackButton, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { TypeParameters } from './type-parameters';
import { PATH } from 'consts/urls';

// FIXME: show back-button only if flags.ICS_APPLY_ENABLED
export const TypeParametersPage: FC = () => (
  <Layout
    title="Operator Type Parameters"
    subtitle="Compare parameters"
    pageName="TypeIcs"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <TypePageSwitcher />
    <IcsProviders>
      <TypeParameters />
    </IcsProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
