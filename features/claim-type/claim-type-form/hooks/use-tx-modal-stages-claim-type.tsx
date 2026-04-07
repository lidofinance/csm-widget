import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import {
  ClaimTypeFormInputType,
  ClaimTypeFormNetworkData,
} from '../context/types';

const getTxModalStagesClaimType = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (_input: ClaimTypeFormInputType, _data: ClaimTypeFormNetworkData) =>
    transitStage(
      <TxStageSign
        title="Claiming ICS type"
        description="Please confirm this transaction in your wallet"
      />,
    ),

  pending: (
    _input: ClaimTypeFormInputType,
    _data: ClaimTypeFormNetworkData,
    txHash?: string,
  ) =>
    transitStage(<TxStagePending title="Claiming ICS type" txHash={txHash} />),

  success: (
    _input: ClaimTypeFormInputType,
    _data: ClaimTypeFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="ICS type has been successfully claimed"
        description=""
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesClaimType = () =>
  useTxCallbackStages<ClaimTypeFormInputType, ClaimTypeFormNetworkData>(
    getTxModalStagesClaimType,
  );
