import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TOKENS } from 'consts/tokens';
import { PATH } from 'consts/urls';
import type { BigNumber } from 'ethers';
import { FC } from 'react';
import { MatomoLink, Plural } from 'shared/components';
import { LocalLink } from 'shared/components/local-link';
import { useBeaconchainDashboardLink } from 'shared/hooks';
import { TxAmount } from 'shared/transaction-modal';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
} from 'shared/transaction-modal/tx-stages-basic';
import styled from 'styled-components';
import { NodeOperatorId } from 'types';

type Props = {
  keysCount: number;
  amount: BigNumber;
  token: TOKENS;
};

type SuccessProps = { nodeOperatorId?: NodeOperatorId; keys: string[] };

const getTxModalStagesSubmitKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ keysCount, amount, token }: Props) =>
    transitStage(
      <TxStageSign
        title="Creating Node Operator"
        description={
          <>
            Uploading {keysCount}{' '}
            <Plural variants={['key', 'keys']} value={keysCount} />{' '}
            {amount && (
              <>
                and depositing <TxAmount amount={amount} token={token} />
              </>
            )}
            .
          </>
        }
      />,
    ),

  pending: ({ keysCount, amount, token }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        txHash={txHash}
        title="Creating Node Operator"
        description={
          <>
            Uploading {keysCount}{' '}
            <Plural variants={['key', 'keys']} value={keysCount} />{' '}
            {amount && (
              <>
                and depositing <TxAmount amount={amount} token={token} />
              </>
            )}
            .
          </>
        }
      />,
    ),

  success: ({ nodeOperatorId, keys }: SuccessProps, txHash?: string) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Node Operator has been created"
        description={
          nodeOperatorId ? (
            <>
              Your Node Operator ID is <b>{nodeOperatorId}</b>
              <br />
              <br />
              <AfterCreationInstructions keys={keys} />
            </>
          ) : undefined
        }
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalStagesSubmitKeys = () => {
  return useTransactionModalStage(getTxModalStagesSubmitKeys);
};

export const AfterCreationInstructions: FC<{ keys: string[] }> = ({ keys }) => {
  const beaconchainDashboardLink = useBeaconchainDashboardLink(undefined, keys);
  return (
    <BlockStyled color="background">
      <b>What is next: </b>
      <br />
      <ol>
        <li>Wait for your keys to be deposited to through the protocol.</li>
        <li>
          Once your keys become active (check the status on{' '}
          <LocalLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab}
            href={PATH.KEYS_VIEW}
          >
            the Keys tab
          </LocalLink>
          ) make sure your validators are producing attestations{' '}
          {beaconchainDashboardLink && (
            <>
              (you can use{' '}
              <MatomoLink
                matomoEvent={
                  MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchainDashboard
                }
                href={beaconchainDashboardLink}
              >
                beaconcha.in
              </MatomoLink>{' '}
              dashboard to check)
            </>
          )}
        </li>
      </ol>
    </BlockStyled>
  );
};

const BlockStyled = styled.div`
  text-align: left;
  line-height: 24px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;

  ol {
    padding-inline-start: 18px;
  }
`;
