import type { BigNumber } from 'ethers';

import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TOKENS } from 'consts/tokens';
import { PATH } from 'consts/urls';
import { MatomoLink } from 'shared/components';
import { TxLinkEtherscan } from 'shared/components/tx-link-etherscan';
import { LocalLink } from 'shared/navigate';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStageClaim,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  amount: BigNumber;
  token: TOKENS;
  claimRewards: boolean;
  rewards?: BigNumber;
};
type SuccessProps = { amount: BigNumber; token: TOKENS };

const { stakeWidget } = getExternalLinks();

const getTxModalStagesClaimBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (props: Props) => transitStage(<TxStageClaim {...props} />),

  pending: (props: Props, txHash?: string) =>
    transitStage(<TxStageClaim {...props} isPending txHash={txHash} />),

  success: ({ amount, token }: SuccessProps, txHash?: string) =>
    transitStage(
      token === TOKENS.ETH ? (
        // TODO: matomo events
        <TxStageSuccess
          title="Withdrawal request has been sent"
          description={
            <>
              Request withdrawal of{' '}
              <TxAmount amount={amount} token={TOKENS.STETH} /> has been sent.
              Check{' '}
              <MatomoLink href={`${stakeWidget}/withdrawals/claim`}>
                Claim tab on the Lido Staking Widget
              </MatomoLink>{' '}
              to view your withdrawal requests or view your transaction on{' '}
              <TxLinkEtherscan txHash={txHash} text="Etherscan" />.
              <br />
              <br />
              Add NFT to your wallet to monitor the status of your request.
              <LocalLink
                href={PATH.BOND_CLAIM}
                anchor="#how-to-claim-eth"
                matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToClaimEthSuccessLink}
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
});

export const useTxModalStagesClaimBond = () => {
  return useTransactionModalStage(getTxModalStagesClaimBond);
};
