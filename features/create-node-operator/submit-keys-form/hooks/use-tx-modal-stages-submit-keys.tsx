import { type NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { TxStageDkgUploading } from 'features/idvtc/dkg/tx-stages/tx-stage-dkg-uploading';
import { TxStageMembersInitializing } from 'features/idvtc/members/tx-stages/tx-stage-members-initializing';
import { Plural } from 'shared/components';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
  useTxStages,
} from 'shared/transaction-modal';
import {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from '../context/types';
import { renderCreateSuccess } from './create-success-stage';

export const useTxModalStagesSubmitKeys = () => {
  return useTxStages<
    SubmitKeysFormInputType,
    SubmitKeysFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    const keysCount = input.depositData.length;
    const amount = input.bondAmount ?? 0n;
    const { token } = input;

    return {
      sign: () =>
        transitStage(
          <TxStageSign
            title="Creating Node Operator"
            description={
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
            }
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title="Creating Node Operator"
            description={
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
            }
          />,
        ),
      // The node operator ID (needed for the DKG upload / members init paths)
      // only exists once the tx is confirmed, which is exactly when this
      // fires. When files were staged or a members init is planned, hand off
      // to the matching holding stage instead of the final success screen —
      // the flow itself runs those steps after this resolves and renders
      // `renderCreateSuccess` (or a failed+retry stage) once they settle.
      success: (result, txHash) => {
        const stagedCount = input.dkgFiles?.length ?? 0;
        if (stagedCount > 0) {
          return transitStage(<TxStageDkgUploading count={stagedCount} />);
        }
        if (data.willInitMembers) {
          return transitStage(<TxStageMembersInitializing />);
        }

        const keys = input.depositData.map((key) => key.pubkey);
        return renderCreateSuccess(transitStage, result, data, keys, txHash);
      },
    };
  });
};
