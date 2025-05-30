"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestWithBlockStep = void 0;
const requestWithBlockStep = (props, request) => {
    const { step, fromBlock, toBlock } = props;
    let from = fromBlock;
    const result = [];
    while (from <= toBlock) {
        const to = from + BigInt(step);
        const nextResult = request({
            fromBlock: from,
            toBlock: to > toBlock ? toBlock : to,
        });
        result.push(nextResult);
        from = to + 1n;
    }
    return result;
};
exports.requestWithBlockStep = requestWithBlockStep;
//# sourceMappingURL=request-with-block-step.js.map