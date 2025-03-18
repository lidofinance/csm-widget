import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import { BigNumber } from '@ethersproject/bignumber';
import { getAggregatorContract } from '@lido-sdk/contracts';
import { getAggregatorAddress, CHAINS } from '@lido-sdk/constants';
import { divide } from '@lido-sdk/helpers';
import { useSDK } from './useSDK.js';
import { useLidoSWR } from './useLidoSWR.js';

const useEthPrice = (config) => {
    const { providerMainnetRpc } = useSDK();
    const address = getAggregatorAddress(CHAINS.Mainnet);
    const aggregatorContract = getAggregatorContract(address, providerMainnetRpc);
    return useLidoSWR(['lido-swr:eth-price', aggregatorContract], () => __awaiter(void 0, void 0, void 0, function* () {
        const [decimals, latestAnswer] = yield Promise.all([
            aggregatorContract.decimals(),
            aggregatorContract.latestAnswer(),
        ]);
        return divide(latestAnswer, BigNumber.from(10).pow(decimals));
    }), config);
};

export { useEthPrice };
