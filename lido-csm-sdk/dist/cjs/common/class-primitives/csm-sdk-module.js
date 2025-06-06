"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsmSDKModule = void 0;
const bus_registry_js_1 = require("./bus-registry.js");
const csm_sdk_cacheable_js_1 = require("./csm-sdk-cacheable.js");
class CsmSDKModule extends csm_sdk_cacheable_js_1.CsmSDKCacheable {
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
        this.bus = props.bus ?? new bus_registry_js_1.BusRegistry();
        if (name) {
            this.bus.register(this, name);
        }
    }
}
exports.CsmSDKModule = CsmSDKModule;
//# sourceMappingURL=csm-sdk-module.js.map