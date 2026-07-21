import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { LocalLink } from 'shared/navigate';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconLimit } from 'shared/transaction-modal/tx-stages-basic/icons';

type Props = {
  nodeOperatorId: bigint;
  retrying?: boolean;
  onRetry: () => void;
};

export const TxStageDkgUploadFailed: FC<Props> = ({
  nodeOperatorId,
  retrying,
  onRetry,
}) => (
  <TransactionModalContent
    icon={<StageIconLimit />}
    title="Node Operator created — file upload failed"
    description={
      <>
        Your Node Operator ID is <b>{nodeOperatorId.toString()}</b>, but the DKG
        files were not uploaded. You can retry now or manage them later.
      </>
    }
    footer={
      <>
        <Button fullwidth onClick={onRetry} loading={retrying}>
          Retry upload
        </Button>
        <LocalLink href={PATH.IDVTC_DKG}>Manage DKG files</LocalLink>
      </>
    }
  />
);
