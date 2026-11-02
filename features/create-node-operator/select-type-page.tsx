import { H2 } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { FormPage, WizardStepper } from 'shared/form-page';
import { Layout } from 'shared/layout';
import { getCsmCreateSteps } from './csm-create-steps';
import { TypeColumnsStyle } from './operator-type-cards/styles';
import { TypeCard } from './operator-type-cards/type-card';
import { TypesDocsNote } from './operator-type-cards/types-docs-note';
import { useVisibleTypes } from './operator-type-cards/use-visible-types';
import { PageHeaderStyle } from './styles';

export const SelectTypePage: FC = () => {
  const types = useVisibleTypes();
  const { steps, current } = getCsmCreateSteps('choose', true);
  const faq = useFaq('BOND', MODULE_NAME.CSM);

  return (
    <Layout title="Create a Node Operator" pageName="SelectOperatorType" wide>
      <FormPage
        steps={<WizardStepper steps={steps} current={current} />}
        faq={<Faq items={faq} />}
      >
        <PageHeaderStyle>
          <H2 as="h1">Choose operator type</H2>
          <TypesDocsNote />
        </PageHeaderStyle>
        <TypeColumnsStyle>
          {types.map((type) => (
            <TypeCard key={type.key} type={type} />
          ))}
        </TypeColumnsStyle>
      </FormPage>
    </Layout>
  );
};
