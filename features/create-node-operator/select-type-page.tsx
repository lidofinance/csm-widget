import { Divider, H2, Hidden, Stack } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useFaq } from 'faq';
import { FC, Fragment } from 'react';
import { Faq } from 'shared/components';
import { FormPage, WizardStepper } from 'shared/form-page';
import { Layout } from 'shared/layout';
import { getCsmCreateSteps } from './csm-create-steps';
import { TypeColumnsCardStyle } from './operator-type-cards/styles';
import { TypeCard } from './operator-type-cards/type-card';
import { TypesDocsNote } from './operator-type-cards/types-docs-note';
import { useVisibleTypes } from './operator-type-cards/use-visible-types';

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
        <Stack gap={8}>
          <H2 as="h1">Choose operator type</H2>
          <TypesDocsNote />
        </Stack>
        <TypeColumnsCardStyle>
          <Stack direction={{ base: 'row', mdDown: 'column' }} gap={24}>
            {types.map((type, index) => (
              <Fragment key={type.key}>
                {index > 0 && (
                  <>
                    <Hidden as="div" below="md">
                      <Divider orientation="vertical" />
                    </Hidden>
                    <Hidden as="div" above="md">
                      <Divider orientation="horizontal" />
                    </Hidden>
                  </>
                )}
                <TypeCard type={type} />
              </Fragment>
            ))}
          </Stack>
        </TypeColumnsCardStyle>
      </FormPage>
    </Layout>
  );
};
