var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CsmSDKCacheable_cache_accessor_storage;
export class CsmSDKCacheable {
    constructor() {
        _CsmSDKCacheable_cache_accessor_storage.set(this, new Map());
    }
    get cache() { return __classPrivateFieldGet(this, _CsmSDKCacheable_cache_accessor_storage, "f"); }
    set cache(value) { __classPrivateFieldSet(this, _CsmSDKCacheable_cache_accessor_storage, value, "f"); }
}
_CsmSDKCacheable_cache_accessor_storage = new WeakMap();
//# sourceMappingURL=csm-sdk-cacheable.js.map