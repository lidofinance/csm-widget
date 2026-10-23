import { useQuery } from '@tanstack/react-query';
import { CONTRACT_NAMES, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { STRATEGY_LAZY } from 'consts';
import { useDappStatus, useSmSDK } from 'modules/web3';
import invariant from 'tiny-invariant';
import { parseAbi, parseEther } from 'viem';

const depositEthAbi = parseAbi([
  'function depositETH(uint256 nodeOperatorId) payable',
]);

// gas does not depend on the amount, only tiny dust deposits take a cheaper path
const ESTIMATE_AMOUNT = parseEther('0.001');

// estimated on-chain instead of a constant: gas costs change with network upgrades
export const useAddBondEthGasLimit = (
  nodeOperatorId: NodeOperatorId | undefined,
  enabled = true,
) => {
  const sdk = useSmSDK();
  const { address } = useDappStatus();

  return useQuery({
    queryKey: [
      'add-bond-eth-gas-limit',
      sdk.core.chainId,
      sdk.core.moduleName,
      nodeOperatorId?.toString(),
      address,
    ],
    ...STRATEGY_LAZY,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      invariant(address);
      return sdk.core.publicClient.estimateContractGas({
        account: address,
        address: sdk.core.getContractAddress(CONTRACT_NAMES.accounting),
        abi: depositEthAbi,
        functionName: 'depositETH',
        args: [nodeOperatorId],
        value: ESTIMATE_AMOUNT,
      });
    },
    enabled: enabled && nodeOperatorId !== undefined && !!address,
    retry: false,
  });
};
