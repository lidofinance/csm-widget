import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import { TxAddressDescription } from '../../shared/tx-address-description';
import { getClaimerAddress, getClaimerStageTitles } from '../claimer-state';
import { ClaimerFormInputType, ClaimerFormNetworkData } from '../context/types';

const getTexts = (input: ClaimerFormInputType) => {
  const titles = getClaimerStageTitles(input.intent);
  const description =
    input.intent === 'unset' ? (
      'Rewards claimer delegation will be removed'
    ) : (
      <TxAddressDescription
        label="New Rewards Claimer Address is"
        address={getClaimerAddress(input)}
      />
    );

  return {
    sign: { title: titles.sign, description },
    success: {
      title: titles.success,
      description:
        input.intent === 'unset'
          ? 'Rewards claimer delegation has been removed'
          : description,
    },
  };
};

export const useTxModalStagesClaimer = () =>
  useTxStages<ClaimerFormInputType, ClaimerFormNetworkData>(
    (transitStage, input) => ({
      sign: () => transitStage(<TxStageSign {...getTexts(input).sign} />),
      pending: (txHash) =>
        transitStage(
          <TxStagePending {...getTexts(input).sign} txHash={txHash} />,
        ),
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess txHash={txHash} {...getTexts(input).success} />,
        ),
    }),
  );
