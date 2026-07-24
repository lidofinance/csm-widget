import { ExtraWidth } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { Gate } from 'shared/navigate';
import { DepositQueue } from './deposit-queue';
import { ViewKeysSection } from './view-keys-section';

export const ViewKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ExtraWidth>
          <Gate rule="IS_CSM">
            <DepositQueue />
          </Gate>
          <ViewKeysSection key={key} />
        </ExtraWidth>
      </NoSSRWrapper>
    </>
  );
};
