"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitKeys = void 0;
const viem_1 = require("viem");
const keys_js_1 = require("../constants/keys.js");
const splitKeys = (value, _count, bytesLength = keys_js_1.PUBKEY_LENGTH) => {
    if (!(0, viem_1.isHex)(value)) {
        throw new Error('is not a hex-like string');
    }
    const count = _count ?? Math.ceil((0, viem_1.size)(value) / bytesLength);
    return Array.from({ length: count }, (_, i) => (0, viem_1.slice)(value, i * count, (i + 1) * count));
};
exports.splitKeys = splitKeys;
//# sourceMappingURL=slitp-keys.js.map