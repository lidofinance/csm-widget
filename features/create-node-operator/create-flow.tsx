import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CREATE_PATH_BY_TYPE } from 'consts/urls';
import { useFaq } from 'faq';
import { FC, useState } from 'react';
import { Faq } from 'shared/components';
import { FormPage, WizardStepper } from 'shared/form-page';
import { getCreateFlow, useCreateOptions } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { useNavigate } from 'shared/navigate';
import { AcknowledgementView } from './acknowledgement';
import { BannerOperatorCustomAddresses } from './banner-operator-custom-addresses';
import { CREATE_CRUMBS } from './create-crumbs';
import { getCsmCreateSteps } from './csm-create-steps';
import { SelectTypeView } from './select-type-view';

export const CreateFlow: FC = () => {
  const { showAck, willChoose, directType } = getCreateFlow(useCreateOptions());
  const [acknowledged, setAcknowledged] = useState(false);
  const navigate = useNavigate();
  const faq = <Faq items={useFaq('BOND', MODULE_NAME.CSM)} />;
  const onAck = showAck && !acknowledged;

  const handleGetStarted = () => {
    if (directType) {
      void navigate(CREATE_PATH_BY_TYPE[directType]);
      return;
    }
    setAcknowledged(true);
    window.scrollTo({ top: 0 });
  };

  const { steps, current } = getCsmCreateSteps(
    onAck ? 'acknowledgement' : 'choose',
    willChoose,
  );

  return (
    <Layout
      wide
      pageName={onAck ? 'CreateAcknowledgement' : 'SelectOperatorType'}
      breadcrumbs={CREATE_CRUMBS}
    >
      <FormPage
        steps={<WizardStepper steps={steps} current={current} />}
        notices={onAck ? <BannerOperatorCustomAddresses /> : undefined}
        faq={faq}
      >
        {onAck ? (
          <AcknowledgementView onGetStarted={handleGetStarted} />
        ) : (
          <SelectTypeView />
        )}
      </FormPage>
    </Layout>
  );
};
