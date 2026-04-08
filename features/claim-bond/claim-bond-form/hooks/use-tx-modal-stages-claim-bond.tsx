import { TOKENS, type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useMemo } from 'react';
import { MatomoLink } from 'shared/components';
import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import { LocalLink } from 'shared/navigate';
import {
  TxAmount,
  TxStageClaim,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  ClaimBondFormInputType,
  ClaimBondFormNetworkData,
} from '../context/types';

const { stakeWidget } = getExternalLinks();

export const useTxModalStagesClaimBond = (): ((
  input: ClaimBondFormInputType,
  data: ClaimBondFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: ClaimBondFormInputType,
        data: ClaimBondFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageClaim
                  amount={input.amount ?? 0n}
                  token={input.token}
                  claimRewards={input.claimRewards}
                  rewards={data.rewards?.available}
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStageClaim
                  amount={input.amount ?? 0n}
                  token={input.token}
                  claimRewards={input.claimRewards}
                  rewards={data.rewards?.available}
                  isPending
                  txHash={txHash}
                />,
              ),
            success: (_result, txHash) =>
              transitStage(
                input.token === TOKENS.eth ? (
                  <TxStageSuccess
                    title="Withdrawal request has been sent"
                    description={
                      <>
                        Request withdrawal of{' '}
                        <TxAmount
                          amount={input.amount ?? 0n}
                          token={TOKENS.steth}
                        />{' '}
                        has been sent. Check{' '}
                        <MatomoLink
                          $inline
                          href={`${stakeWidget}/withdrawals/claim`}
                          matomoEvent={
                            MATOMO_CLICK_EVENTS_TYPES.claimWithdrawalsLink
                          }
                        >
                          Claim tab on the Lido Staking Widget
                        </MatomoLink>{' '}
                        to view your withdrawal requests or view your
                        transaction on{' '}
                        <TxLinkEtherscan txHash={txHash} text="Etherscan" />.
                        <br />
                        <br />
                        Add NFT to your wallet to monitor the status of your
                        request.
                        <LocalLink
                          href={PATH.BOND_CLAIM}
                          anchor="#how-to-claim-eth-using-a-withdrawal-nft"
                          matomoEvent={
                            MATOMO_CLICK_EVENTS_TYPES.howToClaimEthSuccessLink
                          }
                        >
                          This guide
                        </LocalLink>{' '}
                        will help you to do this.
                      </>
                    }
                  />
                ) : (
                  <TxStageSuccess
                    title="Requested amount has been successfully claimed"
                    description={
                      <>
                        Transaction can be viewed on{' '}
                        <TxLinkEtherscan txHash={txHash} text="Etherscan" />.
                      </>
                    }
                  />
                ),
                {
                  isClosableOnLedger: true,
                },
              ),
          },
          onRetry,
        ),
    [transitStage],
  );
};
