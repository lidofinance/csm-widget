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
import { Stack } from 'shared/components';

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
  const ui = useFormUi();

  return (
    <TransactionModalContent
      status="error"
      icon={<StageIconLimit />}
      title="Node Operator created — file upload failed"
      description={
        <>
          Your Node Operator ID is <b>{nodeOperatorId.toString()}</b>, but the
          DKG files were not uploaded. You can retry now or manage them later.
        </>
      }
      footer={
        ui === 'app' ? (
          <>
            <AppButton onClick={onRetry}>Retry upload</AppButton>
            <CenteredTextLink href={PATH.IDVTC_DKG}>
              Manage DKG files
            </CenteredTextLink>
          </>
        ) : (
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
        )
      }
    />
  );
};

TxStageDkgUploadFailed.isClosableOnLedger = true;
