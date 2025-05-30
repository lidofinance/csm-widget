export declare const ValidatorsExitBusOracleAbi: readonly [
  {
    readonly type: 'event';
    readonly name: 'ValidatorExitRequest';
    readonly inputs: readonly [
      {
        readonly name: 'stakingModuleId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'validatorIndex';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'validatorPubkey';
        readonly type: 'bytes';
        readonly indexed: false;
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'timestamp';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
];
//# sourceMappingURL=ValidatorsExitBusOracle.d.ts.map
