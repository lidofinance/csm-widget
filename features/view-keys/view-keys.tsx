import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { ViewKeysSection } from './view-keys-section';
import { Faq } from 'shared/components';
import { DepositQueue } from './deposit-queue';

export const ViewKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <DepositQueue />
        <ViewKeysSection key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
