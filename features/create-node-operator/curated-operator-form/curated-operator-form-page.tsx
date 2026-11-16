import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useFaq } from 'faq';
import { BannerOperatorCustomAddresses } from 'features/create-node-operator/banner-operator-custom-addresses';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { OtherModuleBanner } from '../other-module-banner';
import { useCuratedOperatorCreated } from './context';
import { CuratedOperatorHeader } from './controls/curated-operator-header';
import { CuratedOperatorWizardForm } from './controls/curated-operator-wizard-form';
import { CuratedOperatorSuccess } from './success/curated-operator-success';

export const CuratedOperatorFormPage: FC = () => {
  const faq = useFaq('KEYS', MODULE_NAME.CM);
  const { created } = useCuratedOperatorCreated();
  const done = !!created;

  return (
    <FormPage
      steps={<CuratedOperatorHeader done={done} />}
      notices={
        <>
          <OtherModuleBanner module={MODULE_NAME.CM} />
          <BannerOperatorCustomAddresses />
        </>
      }
      faq={done ? undefined : <Faq items={faq} />}
      done={done}
    >
      {created ? (
        <CuratedOperatorSuccess created={created} />
      ) : (
        <FormReady>
          <CuratedOperatorWizardForm />
        </FormReady>
      )}
    </FormPage>
  );
};
