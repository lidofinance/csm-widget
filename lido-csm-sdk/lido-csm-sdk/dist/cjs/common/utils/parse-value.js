"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValue = void 0;
const viem_1 = require("viem");
const is_bigint_js_1 = require("./is-bigint.js");
const parseValue = (value) => {
    if ((0, is_bigint_js_1.isBigint)(value))
        return value;
    return (0, viem_1.parseEther)(value, 'wei');
};
exports.parseValue = parseValue;
//# sourceMappingURL=parse-value.js.map