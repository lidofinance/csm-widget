import {
  type NodeOperatorShortInfo,
  ROLES,
  getNodeOperatorRoles,
} from '@lidofinance/lido-csm-sdk';
import { useCurveMetadataGetter } from 'shared/hooks';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import styled from 'styled-components';
import {
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
} from '../context/types';
import { CuratedOperatorCustomAddressActions } from '../custom-address-actions';
import { CuratedOperatorSuccessActions } from '../success-actions';

export const useTxModalStagesCuratedOperator = () => {
  const getCurveMetadata = useCurveMetadataGetter();

  return useTxStages<
    CuratedOperatorFormInputType,
    CuratedOperatorFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    const selectedGate = data.availableGates.find(
      (gate) => gate.gateName === input.gateName,
    );
    const metadata = getCurveMetadata(selectedGate?.curveId);

    return {
      sign: () =>
        transitStage(
          <TxStageSign
            title="Creating Curated Node Operator"
            description={
              <>
                Creating operator for <b>{metadata?.name}</b>
              </>
            }
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title="Creating Curated Node Operator"
            description={
              <>
                Creating operator for <b>{metadata?.name}</b>
              </>
            }
          />,
        ),
      success: (result, txHash) => {
        const roles = result ? getNodeOperatorRoles(result, data.address) : [];
        const hasAnyRole = roles.length > 0;
        const hasManagerRole = roles.includes(ROLES.MANAGER);

        return transitStage(
          <TxStageSuccess
            txHash={txHash}
            title="Node Operator has been created"
            description={
              result?.nodeOperatorId !== undefined ? (
                <WrapperSpan>
                  Your Node Operator ID is{' '}
                  <b>{result.nodeOperatorId.toString()}</b>
                </WrapperSpan>
              ) : undefined
            }
            footer={
              hasAnyRole && result?.nodeOperatorId !== undefined ? (
                <CuratedOperatorSuccessActions
                  nodeOperatorId={result.nodeOperatorId}
                  availableGatesCount={data.availableGates.length}
                  hasManagerRole={hasManagerRole}
                />
              ) : (
                <CuratedOperatorCustomAddressActions
                  availableGatesCount={data.availableGates.length}
                />
              )
            }
          />,
        );
      },
    };
  });
};

const WrapperSpan = styled.span`
  display: block;
  margin-bottom: -${({ theme }) => theme.spaceMap.xl}px;
`;
