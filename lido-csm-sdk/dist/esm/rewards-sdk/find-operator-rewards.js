// FIXME: updated report structure
export const findOperatorRewards = (nodeOperatorId, report) => {
    const threshold = report.threshold;
    const operator = report.operators[nodeOperatorId.toString()];
    if (!operator)
        return {
            distributed: 0n,
            validatorsCount: 0,
            validatorsOverThresholdCount: 0,
            threshold,
        };
    const validators = Object.values(operator.validators);
    const overThreshold = validators.filter(({ perf, slashed }) => !slashed && perf.assigned && perf.included / perf.assigned >= threshold);
    return {
        distributed: BigInt(operator.distributed.toString()),
        validatorsCount: validators.length,
        validatorsOverThresholdCount: overThreshold.length,
        threshold,
    };
};
//# sourceMappingURL=find-operator-rewards.js.map