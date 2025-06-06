import { BusRegistry } from './bus-registry.js';
import { CsmSDKCacheable } from './csm-sdk-cacheable.js';
export class CsmSDKModule extends CsmSDKCacheable {
    constructor(props, name) {
        super();
        Object.defineProperty(this, "core", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.core = props.core;
        this.bus = props.bus ?? new BusRegistry();
        if (name) {
            this.bus.register(this, name);
        }
    }
}
//# sourceMappingURL=csm-sdk-module.js.map