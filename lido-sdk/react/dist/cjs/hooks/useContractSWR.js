'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var invariant = require('tiny-invariant');
var useLidoSWR = require('./useLidoSWR.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const useContractSWR = (props) => {
    const { shouldFetch = true, params = [], contract, method, config } = props;
    invariant__default["default"](contract != null, 'Contract is required');
    invariant__default["default"](method != null, 'Method is required');
    return useLidoSWR.useLidoSWR(shouldFetch ? [contract, method, ...params] : null, (contract, method, ...params) => {
        return contract[method](...params);
    }, config);
};

exports.useContractSWR = useContractSWR;
