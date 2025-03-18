'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var useLidoSWR = require('./useLidoSWR.js');

const useLidoSWRImmutable = (key, fetcher, config) => {
    return useLidoSWR.useLidoSWR(key, fetcher, Object.assign({ revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }, config));
};

exports.useLidoSWRImmutable = useLidoSWRImmutable;
