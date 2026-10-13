import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Address, isAddressEqual } from 'viem';
import { useNodeOperator } from '../operator-provider/node-operator-provider';
import { useOperatedNodeOperator } from '../operator-provider/use-operated-node-operator';
import { OperatorTypeStatus, resolveTypeStatus } from '../utils';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import { useOperatorType } from './use-operator-type';
import { useTypeProof } from './use-type-proof';

export const useOperatorTypeStatus = (
  targetType: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC,
): {
  typeStatus: OperatorTypeStatus;
  hasOperator: boolean;
  isPending: boolean;
} => {
  const { address } = useDappStatus();
  const { isPending: operatorsPending } = useNodeOperator();
  const csmSdk = useSmSDK(MODULE_NAME.CSM);
  // A claimer-only wallet applies for itself, not for the operator it claims for.
  const nodeOperator = useOperatedNodeOperator();
  // The type only exists in CSM: an operator of another module never holds it.
  const operator =
    nodeOperator?.module === MODULE_NAME.CSM ? nodeOperator : undefined;
  const hasOperator = !!operator;

  const curve = useOperatorType(operator);

  const isWallet = (a?: Address) =>
    !!a && !!address && isAddressEqual(a, address);
  const owner = operator?.extendedManagerPermissions
    ? operator.managerAddress
    : operator?.rewardsAddress;
  const isOwner = isWallet(owner);
  const otherAddress = [
    operator?.managerAddress,
    operator?.rewardsAddress,
  ].find((a) => !!a && !isWallet(a));

  const ownProof = useTypeProof(targetType, address);
  const otherProof = useTypeProof(targetType, otherAddress);

  const typeStatus = resolveTypeStatus({
    operatorType: curve.data,
    targetType,
    pairedType:
      targetType === OPERATOR_TYPE.CSM_ICS
        ? OPERATOR_TYPE.CSM_IDVTC
        : OPERATOR_TYPE.CSM_ICS,
    hasOperator,
    isOwner,
    proof: ownProof.data,
    otherProof: otherProof.data,
  });

  // A disabled react-query stays pending forever; only wait when CSM is constructed.
  const isPending =
    (!!address && (operatorsPending || (!!csmSdk && ownProof.isPending))) ||
    (hasOperator && curve.isPending) ||
    (!!otherAddress && !!csmSdk && otherProof.isPending);

  return { typeStatus, hasOperator, isPending };
};
