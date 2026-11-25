import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Button, Stack } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useFaq } from 'faq';
import { useSmSDK } from 'modules/web3';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useCanCreate0x02, useOperatorTypeCurve } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { Navigate } from 'shared/navigate';
import {
  TypeHero,
  TypeParametersCard,
} from 'shared/node-operator/type-overview';

export const Type0x02Page: FC = () => {
  const faq = useFaq('OPERATOR_TYPE');
  const sdk = useSmSDK(MODULE_NAME.CSM_02);
  const curve = useOperatorTypeCurve(OPERATOR_TYPE.CSM2_DEF);
  const { canCreate, isAccountActive, isOpen, hasOperator } =
    useCanCreate0x02();
  const showJoin = canCreate || (!isAccountActive && isOpen && !hasOperator);

  if (!sdk || !curve) return <Navigate path={PATH.TYPE} />;

  return (
    <Layout
      wide
      pageName="Type0x02"
      breadcrumbs={[
        { label: 'Operator Type', href: PATH.TYPE },
        { label: '0x02' },
      ]}
    >
      <Stack direction="column" gap={8}>
        <TypeHero
          type={OPERATOR_TYPE.CSM2_DEF}
          cta={
            showJoin ? (
              <Button
                variant="primary"
                href={PATH.CREATE_0x02}
                dataTestId={{ root: 'join0x02Button' }}
              >
                Join 0x02
              </Button>
            ) : undefined
          }
        />
        <TypeParametersCard type={OPERATOR_TYPE.CSM2_DEF} />
      </Stack>
      <Faq items={faq} />
    </Layout>
  );
};
