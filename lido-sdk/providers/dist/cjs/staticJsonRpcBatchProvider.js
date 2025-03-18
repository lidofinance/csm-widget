'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./node_modules/tslib/tslib.es6.js');
var providers = require('@ethersproject/providers');
var properties = require('@ethersproject/properties');
var logger$1 = require('@ethersproject/logger');

/*
 * is based on
 * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/url-json-rpc-provider.ts#L28
 */
const logger = new logger$1.Logger('StaticJsonRpcBatchProvider/1.0');
class StaticJsonRpcBatchProvider extends providers.JsonRpcBatchProvider {
    detectNetwork() {
        const _super = Object.create(null, {
            detectNetwork: { get: () => super.detectNetwork }
        });
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            let network = this.network;
            if (network == null) {
                network = yield _super.detectNetwork.call(this);
                if (!network) {
                    logger.throwError('no network detected', logger$1.Logger.errors.UNKNOWN_ERROR, {});
                }
                // If still not set, set it
                if (this._network == null) {
                    // A static network does not support "any"
                    properties.defineReadOnly(this, '_network', network);
                    this.emit('network', network, null);
                }
            }
            return network;
        });
    }
}

exports.StaticJsonRpcBatchProvider = StaticJsonRpcBatchProvider;
