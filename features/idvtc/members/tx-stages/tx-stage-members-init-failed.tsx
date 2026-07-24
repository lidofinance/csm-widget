import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { LocalLink } from 'shared/navigate';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconLimit } from 'shared/transaction-modal/tx-stages-basic/icons';

type Props = {
  title: string;
  onRetry: () => void;
};

// The tx already succeeded; only the server-side members init failed. The
// title is flow-specific ("Node Operator created — …" / "IDVTC type claimed —
// …"), the recovery options are the same.
export const TxStageMembersInitFailed: FC<Props> = ({ title, onRetry }) => (
  <TransactionModalContent
    icon={<StageIconLimit />}
    title={title}
    description="Cluster members were not initialized from your approved application. You can retry now or do it later on the Cluster members page."
    footer={
      <>
        <Button fullwidth onClick={onRetry}>
          Retry
        </Button>
        <LocalLink href={PATH.IDVTC_MEMBERS}>Manage cluster members</LocalLink>
      </>
    }
  />
);
