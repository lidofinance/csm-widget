import { Button, TextLink } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';
import s from './tx-stage-members-init-failed.module.css';

type Props = {
  title: string;
  onRetry: () => void;
};

// The tx already succeeded; only the server-side members init failed. The
// title is flow-specific ("Node Operator created — …" / "IDVTC type claimed —
// …"), the recovery options are the same.
export const TxStageMembersInitFailed: FC<Props> & ClosableOnLedgerStage = ({
  title,
  onRetry,
}) => {
  return (
    <TransactionModalContent
      status="error"
      title={title}
      description="Cluster members were not initialized from your approved application. You can retry now or do it later on the Cluster members page."
      footer={
        <>
          <Button onClick={onRetry}>Retry</Button>
          <TextLink className={s.centered} href={PATH.IDVTC_MEMBERS}>
            Manage cluster members
          </TextLink>
        </>
      }
    />
  );
};

TxStageMembersInitFailed.isClosableOnLedger = true;
