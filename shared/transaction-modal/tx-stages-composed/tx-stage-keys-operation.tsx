import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';
import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';
import { TxAmount } from '../tx-stages-parts/tx-amount';

import { DescriptorId } from 'shared/node-operator';
import { Plural } from 'shared/components';
import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk/common';

type TxStageSignOperationAmountProps = {
  amount?: bigint;
  token?: TOKENS;
  keysCount: number;
  operationText: string;
  nodeOperatorId?: NodeOperatorId;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageSignOperationKeys = ({
  amount,
  token,
  operationText,
  keysCount,
  nodeOperatorId,
  isPending,
  txHash,
}: TxStageSignOperationAmountProps) => {
  const amountEl = !!amount && token && (
    <TxAmount amount={amount} token={token} />
  );
  const Component = isPending ? TxStagePending : TxStageSign;

  return (
    <Component
      txHash={txHash}
      title={<>Your keys are {operationText.toLowerCase()}</>}
      description={
        !isPending && (
          <>
            {operationText} {keysCount}{' '}
            <Plural variants={['key', 'keys']} value={keysCount} />{' '}
            {!!amount && <>and depositing {amountEl}</>}.{' '}
            {nodeOperatorId !== undefined && (
              <>
                <br />
                <DescriptorId id={nodeOperatorId} />
              </>
            )}
          </>
        )
      }
    />
  );
};
