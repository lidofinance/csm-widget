import { Block } from '@lidofinance/lido-ui';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper, WhenLoaded } from 'shared/components';
import { SiweConnect, SiweSignInAddress } from 'shared/wallet';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status/form-status';
import { ProofStatus } from './form-status/proof-status';
import { IdvtcProviders, useIdvtcState } from './shared';

const IdvtcApplyContent: FC = () => {
  const { isAccountActive } = useDappStatus();
  const { token } = useSiweAuth();
  const { typeStatus, data, isPending, isTypePending, applyMode, reset } =
    useIdvtcState();

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

  if (typeStatus === 'CLAIMED') {
    return <ProofStatus typeStatus={typeStatus} />;
  }

  if (!token) {
    return <SiweSignInAddress operatorType="IDVTC" />;
  }

  if (isPending) {
    return (
      <Block>
        <WhenLoaded loading={true} />
      </Block>
    );
  }

  if (data && !applyMode) {
    return <FormStatus data={data} typeStatus={typeStatus} reset={reset} />;
  }

  if (!data && typeStatus !== 'PENDING') {
    return <ProofStatus typeStatus={typeStatus} />;
  }

  return <ApplyForm />;
};

export const IdvtcApply: FC = () => (
  <NoSSRWrapper>
    <IdvtcProviders>
      <IdvtcApplyContent />
    </IdvtcProviders>
  </NoSSRWrapper>
);
