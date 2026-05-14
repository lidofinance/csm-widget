import { Plural } from 'shared/components';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  EjectKeysFormInputType,
  EjectKeysFormNetworkData,
} from '../context/types';

export const useTxModalStagesEjectKeys = () =>
  useTxStages<EjectKeysFormInputType, EjectKeysFormNetworkData>(
    (transitStage, input) => ({
      sign: () =>
        transitStage(
          <TxStageSign
            title={`Ejecting ${input.selection.length} key(s)`}
            description=""
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            title={`Ejecting ${input.selection.length} key(s)`}
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
                {input.selection.length}{' '}
                <Plural
                  variants={['key has been', 'keys have been']}
                  value={input.selection.length}
                />{' '}
                ejected
              </>
            }
            description=""
          />,
          { isClosableOnLedger: true },
        ),
    }),
  );
