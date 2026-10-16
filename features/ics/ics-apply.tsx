import { Block } from '@lidofinance/lido-ui';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper, WhenLoaded } from 'shared/components';
import { SiweConnect, SiweSignInAddress } from 'shared/wallet';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status';
import { StatusHeader } from './form-status/components';
import { IcsProviders, useIcsState } from './shared';

const IcsApplyContent: FC = () => {
  const { isAccountActive } = useDappStatus();
  const { token } = useSiweAuth();
  const { typeStatus, data, isPending, isTypePending, applyMode, reset } =
    useIcsState();

  const status = (
    <Block>
      <StatusHeader />
    </Block>
  );

  if (!isAccountActive) {
    return (
      <SiweConnect description="Connect your wallet and sign a verification message to continue" />
    );
  }

  if (isTypePending) {
    return (
      <Block>
        <WhenLoaded loading={true} />
      </Block>
    );
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
      <SiweSignInAddress operatorType="ICS" />
    );
  }

  if (isPending) {
    return (
      <Block>
        <WhenLoaded loading={true} />
      </Block>
    );
  }

  if (data && !applyMode) {
    return <FormStatus data={data} reset={reset} />;
  }

  if (typeStatus !== 'PENDING') {
    return status;
  }

  return <ApplyForm />;
};

export const IcsApply: FC = () => {
  return (
    <NoSSRWrapper>
      <IcsProviders>
        <IcsApplyContent />
      </IcsProviders>
    </NoSSRWrapper>
  );
};
