import { type NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { TxStageDkgUploading } from 'features/idvtc/dkg/tx-stages/tx-stage-dkg-uploading';
import { TxStageMembersInitializing } from 'features/idvtc/members/tx-stages/tx-stage-members-initializing';
import { Plural } from 'shared/components';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from '../context/types';
import { getCreateHoldStage } from './create-hold-stage';

export const useTxModalStagesSubmitKeys = () => {
  return useTxStages<
    SubmitKeysFormInputType,
    SubmitKeysFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    const keysCount = input.depositData.length;
    const amount = input.bondAmount ?? 0n;
    const { token } = input;
    const stagedFiles = input.dkgFiles?.length ?? 0;

    const description = (
      <>
        Uploading {keysCount}{' '}
        <Plural variants={['key', 'keys']} value={keysCount} />{' '}
        {!!amount && (
          <>
            and depositing <TxAmount amount={amount} token={token} />
          </>
        )}
        .
      </>
    );

    return {
      sign: () =>
        transitStage(
          <TxStageSign
            title="Creating Node Operator"
            description={description}
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title="Creating Node Operator"
            description={description}
          />,
        ),
      // Fires before the SDK promise resolves; the flow closes the modal once the success screen is set
      success: (result, txHash) => {
        const stage = getCreateHoldStage({
          hasResult: !!result,
          stagedFiles,
          willInitMembers: !!data.willInitMembers,
        });

        if (stage === 'created-without-id') {
          return transitStage(
            <TxStageSuccess
              txHash={txHash}
              title="Node Operator has been created"
              description={undefined}
            />,
          );
        }
        if (stage === 'dkg-upload') {
          return transitStage(<TxStageDkgUploading count={stagedFiles} />);
        }
        if (stage === 'members-init') {
          return transitStage(<TxStageMembersInitializing />);
        }
        return transitStage(
          <TxStagePending
            txHash={txHash}
            title="Creating Node Operator"
            description={description}
          />,
        );
      },
    };
  });
};
