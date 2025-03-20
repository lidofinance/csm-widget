import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import { BigNumber } from '@ethersproject/bignumber';
import { WeiPerEther } from '@ethersproject/constants';
import { divide } from '@lido-sdk/helpers';
import { useMemo, useCallback } from 'react';
import { useEthereumSWR } from './useEthereumSWR.js';
import { useEthPrice } from './useEthPrice.js';

const getTxPrice = (gasLimit, ethPrice, gasPrice) => {
    if (!gasLimit || ethPrice == null || gasPrice == null) {
        return undefined;
    }
    const txCostInWei = gasPrice.mul(BigNumber.from(gasLimit));
    const txCostInEth = divide(txCostInWei, WeiPerEther);
    return ethPrice * txCostInEth;
};
const useTxPrice = (gasLimit) => {
    const eth = useEthPrice();
    const gas = useEthereumSWR({ method: 'getGasPrice' });
    const ethPrice = eth.data;
    const gasPrice = gas.data;
    const data = useMemo(() => {
        return getTxPrice(gasLimit, ethPrice, gasPrice);
    }, [gasLimit, ethPrice, gasPrice]);
    const updateEth = eth.update;
    const updateGas = gas.update;
    const update = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        const [ethPrice, gasPrice] = yield Promise.all([updateEth(), updateGas()]);
        return getTxPrice(gasLimit, ethPrice, gasPrice);
    }), [gasLimit, updateEth, updateGas]);
    return {
        update,
        data,
        /*
         * support dependency collection
         * https://swr.vercel.app/advanced/performance#dependency-collection
         */
        get loading() {
            return eth.loading || gas.loading;
        },
        get initialLoading() {
            return eth.initialLoading || gas.initialLoading;
        },
        get error() {
            return eth.error || gas.error;
        },
    };
};

export { useTxPrice };
