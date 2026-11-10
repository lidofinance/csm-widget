import { Card, Skeleton } from '@lidofinance/lido-app-ui';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import { SiweConnect, SiweSignInAddress } from 'shared/wallet';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status/form-status';
import { OperatorTypeCard } from './form-status/components';
import { IdvtcProviders, useIdvtcState } from './shared';

const Loader: FC = () => (
  <Card data-testid="loader">
    <StretchStack>
      <Skeleton variant="text" lines={3} />
    </StretchStack>
  </Card>
);

const IdvtcApplyContent: FC = () => {
  const { isAccountActive } = useDappStatus();
  const { token } = useSiweAuth();
  const { typeStatus, data, isPending, isTypePending, applyMode, reset } =
    useIdvtcState();

  const status = <OperatorTypeCard />;

  if (!isAccountActive) {
    return (
      <SiweConnect description="Connect your wallet and sign a verification message to continue" />
    );
  }

  if (isTypePending) {
    return <Loader />;
  }

  if (
    typeStatus === 'CLAIMED' ||
    typeStatus === 'PROOF_USED' ||
    typeStatus === 'PROOF_USED_ELSEWHERE'
  ) {
    return status;
  }

  if (!token) {
    return typeStatus !== 'PENDING' ? (
      status
    ) : (
      <SiweSignInAddress operatorType="IDVTC" />
    );
  }

  if (isPending) {
    return <Loader />;
  }

  if (data && !applyMode) {
    return <FormStatus data={data} reset={reset} />;
  }

  if (typeStatus !== 'PENDING') {
    return status;
  }

  return <ApplyForm />;
};

export const IdvtcApply: FC = () => (
  <IdvtcProviders>
    <IdvtcApplyContent />
  </IdvtcProviders>
);
