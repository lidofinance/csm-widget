import { Button as AppButton, TextLink } from '@lidofinance/lido-app-ui';
import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { PATH } from 'consts/urls';
import { useFormUi } from 'shared/hook-form/form-ui';
import { LocalLink } from 'shared/navigate';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconLimit } from 'shared/transaction-modal/tx-stages-basic/icons';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';

const CenteredTextLink = styled(TextLink)`
  align-self: center;
`;

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
  const ui = useFormUi();

  return (
    <TransactionModalContent
      status="error"
      icon={<StageIconLimit />}
      title={title}
      description="Cluster members were not initialized from your approved application. You can retry now or do it later on the Cluster members page."
      footer={
        ui === 'app' ? (
          <>
            <AppButton onClick={onRetry}>Retry</AppButton>
            <CenteredTextLink href={PATH.IDVTC_MEMBERS}>
              Manage cluster members
            </CenteredTextLink>
          </>
        ) : (
          <>
            <Button fullwidth onClick={onRetry}>
              Retry
            </Button>
            <LocalLink href={PATH.IDVTC_MEMBERS}>
              Manage cluster members
            </LocalLink>
          </>
        )
      }
    />
  );
};

TxStageMembersInitFailed.isClosableOnLedger = true;
