"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOperatorRewards = void 0;
const findOperatorRewards = (nodeOperatorId, report) => {
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
exports.findOperatorRewards = findOperatorRewards;
//# sourceMappingURL=find-operator-rewards.js.map