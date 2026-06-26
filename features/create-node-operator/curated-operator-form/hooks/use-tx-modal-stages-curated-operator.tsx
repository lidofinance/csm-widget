import {
  MODULE_NAME,
  type NodeOperatorShortInfo,
  ROLES,
  getNodeOperatorRoles,
} from '@lidofinance/lido-csm-sdk';
import { getCurveMetadata } from 'consts';
import { useSmSDKByModule } from 'modules/web3';
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
  const sm = useSmSDKByModule(MODULE_NAME.CM);
  const moduleName = sm.core.moduleName;

  return useTxStages<
    CuratedOperatorFormInputType,
    CuratedOperatorFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    const selectedGate = data.availableGates.find(
      (gate) => gate.gateName === input.gateName,
    );
    const curveId = selectedGate?.curveId ?? 0n;

    return {
      sign: () =>
        transitStage(
          <TxStageSign
            title="Creating Curated Node Operator"
            description={
              <>
                Creating operator for{' '}
                <b>{getCurveMetadata(moduleName, curveId).name}</b>
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
                Creating operator for{' '}
                <b>{getCurveMetadata(moduleName, curveId).name}</b>
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
              hasAnyRole ? (
                <CuratedOperatorSuccessActions
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
          {
            isClosableOnLedger: true,
          },
        );
      },
    };
  });
};

const WrapperSpan = styled.span`
  display: block;
  margin-bottom: -${({ theme }) => theme.spaceMap.xl}px;
`;
