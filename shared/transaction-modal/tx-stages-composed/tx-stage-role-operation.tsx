import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';
import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';

type TxStageSignOperationAmountProps = {
  address: string;
  role: string;
  operationText: string;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageSignOperationRole = ({
  address,
  role,
  operationText,
  isPending,
  txHash,
}: TxStageSignOperationAmountProps) => {
  const Component = isPending ? TxStagePending : TxStageSign;

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are {operationText.toLowerCase()} {role}
        </>
      }
      description={!isPending && <>{address}</>}
    />
  );
};
