import { Plural } from 'shared/components';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData,
} from '../context/types';

export const useTxModalStagesRemoveKeys = () =>
  useTxStages<RemoveKeysFormInputType, RemoveKeysFormNetworkData>(
    (transitStage, input) => ({
      sign: () =>
        transitStage(
          <TxStageSign
            title={`Removing ${input.selection.count} key(s)`}
            description=""
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            title={`Removing ${input.selection.count} key(s)`}
            description=""
            txHash={txHash}
          />,
        ),
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title={
              <>
                {input.selection.count}{' '}
                <Plural
                  variants={['key', 'keys']}
                  value={input.selection.count}
                />{' '}
                has been removed
              </>
            }
            description=""
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
