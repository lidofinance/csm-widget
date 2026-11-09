import { Button, TextLink } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { PATH } from 'consts/urls';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';

const CenteredTextLink = styled(TextLink)`
  align-self: center;
`;

type Props = {
  nodeOperatorId: bigint;
  onRetry: () => void;
};

export const TxStageDkgUploadFailed: FC<Props> & ClosableOnLedgerStage = ({
  nodeOperatorId,
  onRetry,
}) => {
  return (
    <TransactionModalContent
      status="error"
      title="Node Operator created — file upload failed"
      description={
        <>
          Your Node Operator ID is <b>{nodeOperatorId.toString()}</b>, but the
          DKG files were not uploaded. You can retry now or manage them later.
        </>
      }
      footer={
        <>
          <Button onClick={onRetry}>Retry upload</Button>
          <CenteredTextLink href={PATH.IDVTC_DKG}>
            Manage DKG files
          </CenteredTextLink>
        </>
      }
    />
  );
};

TxStageDkgUploadFailed.isClosableOnLedger = true;
