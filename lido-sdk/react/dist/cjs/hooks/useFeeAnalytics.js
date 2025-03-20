'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('@ethersproject/constants');
var useFeeHistory = require('./useFeeHistory.js');

const calculatePercentile = (array, target) => {
    const lessThenTarget = array.reduce((counter, current) => (current.lt(target) ? counter + 1 : counter), 0);
    return array.length ? lessThenTarget / array.length : 1;
};
const useFeeAnalytics = (props) => {
    var _a;
    const history = useFeeHistory.useFeeHistory(props);
    const { data, mutate, update } = history;
    const feeHistory = (data === null || data === void 0 ? void 0 : data.baseFeePerGas) || [];
    const baseFee = (_a = feeHistory[feeHistory.length - 1]) !== null && _a !== void 0 ? _a : constants.Zero;
    const percentile = calculatePercentile([...feeHistory], baseFee);
    return {
        data,
        percentile,
        baseFee,
        mutate,
        update,
        /*
         * support dependency collection
         * https://swr.vercel.app/advanced/performance#dependency-collection
         */
        get loading() {
            return history.loading;
        },
        get initialLoading() {
            return history.initialLoading;
        },
        get error() {
            return history.error;
        },
    };
};

exports.calculatePercentile = calculatePercentile;
exports.useFeeAnalytics = useFeeAnalytics;
