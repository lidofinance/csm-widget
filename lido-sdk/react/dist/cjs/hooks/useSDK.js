'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var invariant = require('tiny-invariant');
var SDK = require('../context/SDK.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const useSDK = () => {
    const contextValue = react.useContext(SDK.SDKContext);
    invariant__default["default"](contextValue, 'useSDK was used outside of SDKContext');
    return contextValue;
};

exports.useSDK = useSDK;
