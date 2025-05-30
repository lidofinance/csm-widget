export declare const CSExitPenaltiesAbi: readonly [
  {
    readonly type: 'constructor';
    readonly inputs: readonly [
      {
        readonly name: 'module';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'parametersRegistry';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'strikes';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'ACCOUNTING';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'contract ICSAccounting';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'MODULE';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'contract ICSModule';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'PARAMETERS_REGISTRY';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'contract ICSParametersRegistry';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'STRIKES';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'STRIKES_EXIT_TYPE_ID';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint8';
        readonly internalType: 'uint8';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'VOLUNTARY_EXIT_TYPE_ID';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint8';
        readonly internalType: 'uint8';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getExitPenaltyInfo';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'publicKey';
        readonly type: 'bytes';
        readonly internalType: 'bytes';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'tuple';
        readonly internalType: 'struct ExitPenaltyInfo';
        readonly components: readonly [
          {
            readonly name: 'delayPenalty';
            readonly type: 'tuple';
            readonly internalType: 'struct MarkedUint248';
            readonly components: readonly [
              {
                readonly name: 'value';
                readonly type: 'uint248';
                readonly internalType: 'uint248';
              },
              {
                readonly name: 'isValue';
                readonly type: 'bool';
                readonly internalType: 'bool';
              },
            ];
          },
          {
            readonly name: 'strikesPenalty';
            readonly type: 'tuple';
            readonly internalType: 'struct MarkedUint248';
            readonly components: readonly [
              {
                readonly name: 'value';
                readonly type: 'uint248';
                readonly internalType: 'uint248';
              },
              {
                readonly name: 'isValue';
                readonly type: 'bool';
                readonly internalType: 'bool';
              },
            ];
          },
          {
            readonly name: 'withdrawalRequestFee';
            readonly type: 'tuple';
            readonly internalType: 'struct MarkedUint248';
            readonly components: readonly [
              {
                readonly name: 'value';
                readonly type: 'uint248';
                readonly internalType: 'uint248';
              },
              {
                readonly name: 'isValue';
                readonly type: 'bool';
                readonly internalType: 'bool';
              },
            ];
          },
        ];
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'isValidatorExitDelayPenaltyApplicable';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'publicKey';
        readonly type: 'bytes';
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'eligibleToExitInSec';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'bool';
        readonly internalType: 'bool';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'processExitDelayReport';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'publicKey';
        readonly type: 'bytes';
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'eligibleToExitInSec';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'processStrikesReport';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'publicKey';
        readonly type: 'bytes';
        readonly internalType: 'bytes';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'processTriggeredExit';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'publicKey';
        readonly type: 'bytes';
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'withdrawalRequestPaidFee';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'exitType';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'event';
    readonly name: 'StrikesPenaltyProcessed';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'pubkey';
        readonly type: 'bytes';
        readonly indexed: false;
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'strikesPenalty';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'TriggeredExitFeeRecorded';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'exitType';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'pubkey';
        readonly type: 'bytes';
        readonly indexed: false;
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'withdrawalRequestPaidFee';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'withdrawalRequestRecordedFee';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ValidatorExitDelayProcessed';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'pubkey';
        readonly type: 'bytes';
        readonly indexed: false;
        readonly internalType: 'bytes';
      },
      {
        readonly name: 'delayPenalty';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'error';
    readonly name: 'SafeCastOverflowedUintDowncast';
    readonly inputs: readonly [
      {
        readonly name: 'bits';
        readonly type: 'uint8';
        readonly internalType: 'uint8';
      },
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
  },
  {
    readonly type: 'error';
    readonly name: 'SenderIsNotModule';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'SenderIsNotStrikes';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ValidatorExitDelayAlreadyReported';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ValidatorExitDelayNotApplicable';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroModuleAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroParametersRegistryAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroStrikesAddress';
    readonly inputs: readonly [];
  },
];
//# sourceMappingURL=CSExitPenalties.d.ts.map
