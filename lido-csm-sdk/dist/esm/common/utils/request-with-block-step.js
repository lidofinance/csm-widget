export const requestWithBlockStep = (props, request) => {
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
//# sourceMappingURL=request-with-block-step.js.map