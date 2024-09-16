import type { BigNumber } from 'ethers';

import { TOKENS } from 'consts/tokens';
import { MatomoLink } from 'shared/components';
import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStageOperationSucceedBalanceShown,
  TxStageSignOperationAmount,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

const STAGE_OPERATION_ARGS = {
  operationText: 'Claiming Bond',
};

type Props = { amount: BigNumber; token: TOKENS };
type SuccessProps = { amount: BigNumber; balance: BigNumber; token: TOKENS };

const getTxModalStagesClaimBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ amount, token }: Props) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        operationText="Claiming"
        willReceive={amount}
        willReceiveToken={token}
        amount={amount}
        token={token}
      />,
    ),

  pending: ({ amount, token }: Props, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        operationText="Claiming"
        willReceive={amount}
        willReceiveToken={token}
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),

  success: ({ amount, balance, token }: SuccessProps, txHash?: string) =>
    transitStage(
      token === TOKENS.ETH ? (
        <TxStageSuccess
          title="Withdrawal request has been sent"
          description={
            <>
              Request withdrawal of{' '}
              <TxAmount amount={amount} token={TOKENS.STETH} /> has been sent.
              Check{' '}
              <MatomoLink href="https://stake.lido.fi/claim">
                Claim tab on the Lido Staking Widget
              </MatomoLink>{' '}
              to view your withdrawal requests or view your transaction on{' '}
              <TxLinkEtherscan txHash={txHash} text="Etherscan" />.
              <br />
              <br />
              Add NFT to your wallet to monitor the status of your request.
              <MatomoLink href="">This guide</MatomoLink> will help you to do
              this.
            </>
          }
        />
      ) : (
        <TxStageOperationSucceedBalanceShown
          {...STAGE_OPERATION_ARGS}
          txHash={txHash}
          balance={balance}
          balanceToken={TOKENS.STETH}
        />
      ),
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesClaimBond = () => {
  return useTransactionModalStage(getTxModalStagesClaimBond);
};
