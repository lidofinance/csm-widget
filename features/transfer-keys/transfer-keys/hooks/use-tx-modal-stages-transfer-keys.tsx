import { CurveParameters, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { Plural } from 'shared/components';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { AfterTransferWarning } from './after-transfer-warning';

type Props = {
  keysCount: number;
};

type SuccessProps = Props & {
  operatorInfo: NodeOperatorInfo;
  curveParameters: CurveParameters;
};

const getTxModalStagesTransferKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (props: Props) =>
    transitStage(
      <TxStageSign
        title={`Transfering ${props.keysCount} key(s) to priority queue`}
        description=""
      />,
    ),

  pending: (props: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title={`Transfering ${props.keysCount} key(s) to priority queue`}
        description=""
        txHash={txHash}
      />,
    ),

  success: (props: SuccessProps, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          <>
            {props.keysCount}{' '}
            <Plural variants={['key', 'keys']} value={props.keysCount} /> has
            been transfered to priority queue
          </>
        }
        description={
          <>
            <AfterTransferWarning
              operatorInfo={props.operatorInfo}
              curveParameters={props.curveParameters}
            />
          </>
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesTransferKeys = () => {
  return useTransactionModalStage(getTxModalStagesTransferKeys);
};
