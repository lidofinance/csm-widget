export const ExitBusOracleAbi = [
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
] as const;
