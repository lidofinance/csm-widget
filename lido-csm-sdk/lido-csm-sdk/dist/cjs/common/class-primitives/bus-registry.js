"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusRegistry = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
class BusRegistry {
    constructor() {
        Object.defineProperty(this, "sdks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    register(sdk, name) {
        if (this.sdks[name]) {
            throw new Error(`Module ${name.toString()} already registered`);
        }
        this.sdks[name] = sdk;
    }
    get(name) {
        return this.sdks[name];
    }
    getOrThrow(name) {
        (0, lido_ethereum_sdk_1.invariant)(this.sdks[name], `Module ${name.toString()} not registered`, lido_ethereum_sdk_1.ERROR_CODE.UNKNOWN_ERROR);
        return this.sdks[name];
    }
}
exports.BusRegistry = BusRegistry;
//# sourceMappingURL=bus-registry.js.map