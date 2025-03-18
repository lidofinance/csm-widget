import { __awaiter } from './node_modules/tslib/tslib.es6.js';
import { JsonRpcBatchProvider } from '@ethersproject/providers';
import { defineReadOnly } from '@ethersproject/properties';
import { Logger } from '@ethersproject/logger';

/*
 * is based on
 * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/url-json-rpc-provider.ts#L28
 */
const logger = new Logger('StaticJsonRpcBatchProvider/1.0');
class StaticJsonRpcBatchProvider extends JsonRpcBatchProvider {
    detectNetwork() {
        const _super = Object.create(null, {
            detectNetwork: { get: () => super.detectNetwork }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let network = this.network;
            if (network == null) {
                network = yield _super.detectNetwork.call(this);
                if (!network) {
                    logger.throwError('no network detected', Logger.errors.UNKNOWN_ERROR, {});
                }
                // If still not set, set it
                if (this._network == null) {
                    // A static network does not support "any"
                    defineReadOnly(this, '_network', network);
                    this.emit('network', network, null);
                }
            }
            return network;
        });
    }
}

export { StaticJsonRpcBatchProvider };
