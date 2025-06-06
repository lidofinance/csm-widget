import { ERROR_CODE, invariant } from '@lidofinance/lido-ethereum-sdk';
export class BusRegistry {
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
        invariant(this.sdks[name], `Module ${name.toString()} not registered`, ERROR_CODE.UNKNOWN_ERROR);
        return this.sdks[name];
    }
}
//# sourceMappingURL=bus-registry.js.map