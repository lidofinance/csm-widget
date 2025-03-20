import invariant from 'tiny-invariant';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR.js';
import { useSDK } from './useSDK.js';

const useDecimals = (token, config) => {
    const { providerRpc } = useSDK();
    invariant(token != null, 'Token address is required');
    const contract = getERC20Contract(token, providerRpc);
    const result = useContractSWR({ contract, method: 'decimals', config });
    return result;
};

export { useDecimals };
