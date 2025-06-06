"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorsExitBusOracleAbi = void 0;
exports.ValidatorsExitBusOracleAbi = [
    {
        type: 'event',
        name: 'ValidatorExitRequest',
        inputs: [
            {
                name: 'stakingModuleId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'validatorIndex',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'validatorPubkey',
                type: 'bytes',
                indexed: false,
                internalType: 'bytes',
            },
            {
                name: 'timestamp',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
];
//# sourceMappingURL=ValidatorsExitBusOracle.js.map