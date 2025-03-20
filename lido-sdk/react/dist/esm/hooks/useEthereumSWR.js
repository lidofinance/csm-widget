import invariant from 'tiny-invariant';
import { useLidoSWR } from './useLidoSWR.js';
import { useSDK } from './useSDK.js';

const useEthereumSWR = (props) => {
    var _a;
    const { shouldFetch = true, params = [], method, config } = props;
    const providerRpcFromSdk = useSDK().providerRpc;
    const providerRpc = (_a = props.providerRpc) !== null && _a !== void 0 ? _a : providerRpcFromSdk;
    invariant(providerRpc != null, 'RPC Provider is not provided');
    invariant(method != null, 'Method is required');
    return useLidoSWR(shouldFetch ? [providerRpc, method, ...params] : null, (providerRpc, method, ...params) => {
        return providerRpc[method](...params);
    }, config);
};

export { useEthereumSWR };
