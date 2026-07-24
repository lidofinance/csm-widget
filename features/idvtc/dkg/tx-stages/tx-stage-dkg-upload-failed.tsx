import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { LocalLink } from 'shared/navigate';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconLimit } from 'shared/transaction-modal/tx-stages-basic/icons';
import { Stack } from 'shared/components';

type Props = {
  nodeOperatorId: bigint;
  onRetry: () => void;
};

export const TxStageDkgUploadFailed: FC<Props> = ({
  nodeOperatorId,
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
      <Stack direction="column" gap="sm">
        <Button fullwidth onClick={onRetry} size="sm">
          Retry upload
        </Button>

        <LocalLink href={PATH.IDVTC_DKG}>
          <Button fullwidth size="sm" variant="translucent">
            Manage DKG files
          </Button>
        </LocalLink>
      </Stack>
    }
  />
);
