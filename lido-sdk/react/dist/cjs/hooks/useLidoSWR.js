'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var useSWRSource = require('swr');
var useSDK = require('./useSDK.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var useSWRSource__default = /*#__PURE__*/_interopDefaultLegacy(useSWRSource);

const LIDO_SWR_DEFAULT_CONFIG = {
    errorRetryInterval: 10000,
    focusThrottleInterval: 10000,
};
const useLidoSWR = (key, fetcher, config) => {
    const { swrConfig } = useSDK.useSDK();
    const result = useSWRSource__default["default"](key, fetcher, Object.assign(Object.assign(Object.assign({}, LIDO_SWR_DEFAULT_CONFIG), swrConfig), config));
    const mutate = result.mutate;
    const update = react.useCallback(() => {
        return mutate(undefined, true);
    }, [mutate]);
    return {
        mutate,
        update,
        /*
         * support dependency collection
         * https://swr.vercel.app/advanced/performance#dependency-collection
         */
        get data() {
            return result.data;
        },
        get loading() {
            return result.isValidating;
        },
        get initialLoading() {
            return result.data == null && result.isValidating;
        },
        get error() {
            return result.error;
        },
    };
};

exports.useLidoSWR = useLidoSWR;
