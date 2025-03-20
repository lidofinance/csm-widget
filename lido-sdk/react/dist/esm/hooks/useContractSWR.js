import invariant from 'tiny-invariant';
import { useLidoSWR } from './useLidoSWR.js';

const useContractSWR = (props) => {
    const { shouldFetch = true, params = [], contract, method, config } = props;
    invariant(contract != null, 'Contract is required');
    invariant(method != null, 'Method is required');
    return useLidoSWR(shouldFetch ? [contract, method, ...params] : null, (contract, method, ...params) => {
        return contract[method](...params);
    }, config);
};

export { useContractSWR };
