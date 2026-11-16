import { Card, Skeleton } from '@lidofinance/lido-app-ui';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { StretchStack } from 'shared/components';
import { SiweConnect, SiweSignInAddress } from 'shared/wallet';
import { TypeProgram } from './consts';
import { OperatorTypeCard } from './operator-type-card';
import { TypeApplyState } from './use-type-apply-state';

type Props = {
  program: TypeProgram;
  state: TypeApplyState<unknown>;
  formStatus: ReactNode;
  form: ReactNode;
};

const Loader: FC = () => (
  <Card data-testid="loader">
    <StretchStack>
      <Skeleton variant="text" lines={3} />
    </StretchStack>
  </Card>
);

/** Picks the apply-page view: connect, sign in, operator type status, submitted application or the form. */
export const TypeApplyGate: FC<Props> = ({
  program,
  state,
  formStatus,
  form,
}) => {
  const { isAccountActive } = useDappStatus();
  const { token } = useSiweAuth();
  const { typeStatus, hasOperator, data, isPending, isTypePending, applyMode } =
    state;

  const status = (
    <OperatorTypeCard
      program={program}
      typeStatus={typeStatus}
      hasOperator={hasOperator}
    />
  );

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
      <SiweSignInAddress operatorType={program} />
    );
  }

  if (isPending) {
    return <Loader />;
  }

  if (data && !applyMode) {
    return <>{formStatus}</>;
  }

  if (typeStatus !== 'PENDING') {
    return status;
  }

  return <>{form}</>;
};
