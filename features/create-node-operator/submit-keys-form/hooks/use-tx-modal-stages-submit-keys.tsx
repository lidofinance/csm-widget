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
import { MatomoLink } from 'shared/components';
import { LocalLink } from 'shared/components/local-link';
import { useBeaconchainDashboardLink } from 'shared/hooks';
import { TxStageSuccess } from 'shared/transaction-modal/tx-stages-basic';
import { TxStageSignOperationKeys } from 'shared/transaction-modal/tx-stages-composed/tx-stage-keys-operation';
import styled from 'styled-components';
import { NodeOperatorId } from 'types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Submitting',
};

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
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
        keysCount={keysCount}
      />,
    ),

  pending: ({ keysCount, amount, token }: Props, txHash?: string) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
        keysCount={keysCount}
        isPending
        txHash={txHash}
      />,
    ),

  success: ({ nodeOperatorId, keys }: SuccessProps, txHash?: string) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Your keys are submitted</>}
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
  const beaconchainDashboardLink = useBeaconchainDashboardLink(keys);
  return (
    <BlockStyled color="background">
      <b>What is next: </b>
      <br />
      <ol>
        <li>Wait for your keys to be deposited through the protocol.</li>
        <li>
          Once your keys become active (check the status on{' '}
          <LocalLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab}
            href={PATH.KEYS_VIEW}
          >
            the Keys tab
          </LocalLink>
          ) make sure your validators are attesting blocks (you can use{' '}
          <MatomoLink
            matomoEvent={
              MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchainDashboard
            }
            href={beaconchainDashboardLink}
          >
            beaconcha.in
          </MatomoLink>{' '}
          dashboard to check)
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
