export declare const CSParametersRegistryAbi: readonly [
  {
    readonly type: 'constructor';
    readonly inputs: readonly [
      {
        readonly name: 'queueLowestPriority';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'DEFAULT_ADMIN_ROLE';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'QUEUE_LEGACY_PRIORITY';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'QUEUE_LOWEST_PRIORITY';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultAllowedExitDelay';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultBadPerformancePenalty';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultElRewardsStealingAdditionalFine';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultExitDelayPenalty';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultKeyRemovalCharge';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultKeysLimit';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultMaxWithdrawalRequestFee';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultPerformanceCoefficients';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: 'attestationsWeight';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
      {
        readonly name: 'blocksWeight';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
      {
        readonly name: 'syncWeight';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultPerformanceLeeway';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultQueueConfig';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: 'priority';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
      {
        readonly name: 'maxDeposits';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultRewardShare';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'defaultStrikesParams';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: 'lifetime';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
      {
        readonly name: 'threshold';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getAllowedExitDelay';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'delay';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getBadPerformancePenalty';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getElRewardsStealingAdditionalFine';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'fine';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getExitDelayPenalty';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getInitializedVersion';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint64';
        readonly internalType: 'uint64';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getKeyRemovalCharge';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'keyRemovalCharge';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getKeysLimit';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'limit';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getMaxWithdrawalRequestFee';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'fee';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getPerformanceCoefficients';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'attestationsWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'blocksWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'syncWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getPerformanceLeewayData';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'data';
        readonly type: 'tuple[]';
        readonly internalType: 'struct ICSParametersRegistry.KeyNumberValueInterval[]';
        readonly components: readonly [
          {
            readonly name: 'minKeyNumber';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'value';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getQueueConfig';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'queuePriority';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
      {
        readonly name: 'maxDeposits';
        readonly type: 'uint32';
        readonly internalType: 'uint32';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getRewardShareData';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'data';
        readonly type: 'tuple[]';
        readonly internalType: 'struct ICSParametersRegistry.KeyNumberValueInterval[]';
        readonly components: readonly [
          {
            readonly name: 'minKeyNumber';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'value';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getRoleAdmin';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getRoleMember';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'index';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
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
    readonly name: 'getRoleMemberCount';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getStrikesParams';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'lifetime';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'threshold';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'grantRole';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'account';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'hasRole';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'account';
        readonly type: 'address';
        readonly internalType: 'address';
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
    readonly name: 'initialize';
    readonly inputs: readonly [
      {
        readonly name: 'admin';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'data';
        readonly type: 'tuple';
        readonly internalType: 'struct ICSParametersRegistry.InitializationData';
        readonly components: readonly [
          {
            readonly name: 'keyRemovalCharge';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'elRewardsStealingAdditionalFine';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'keysLimit';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'rewardShare';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'performanceLeeway';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'strikesLifetime';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'strikesThreshold';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'defaultQueuePriority';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'defaultQueueMaxDeposits';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'badPerformancePenalty';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'attestationsWeight';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'blocksWeight';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'syncWeight';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'defaultAllowedExitDelay';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'defaultExitDelayPenalty';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'defaultMaxWithdrawalRequestFee';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'renounceRole';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'callerConfirmation';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'revokeRole';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'account';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setAllowedExitDelay';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'delay';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setBadPerformancePenalty';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultAllowedExitDelay';
    readonly inputs: readonly [
      {
        readonly name: 'delay';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultBadPerformancePenalty';
    readonly inputs: readonly [
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultElRewardsStealingAdditionalFine';
    readonly inputs: readonly [
      {
        readonly name: 'fine';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultExitDelayPenalty';
    readonly inputs: readonly [
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultKeyRemovalCharge';
    readonly inputs: readonly [
      {
        readonly name: 'keyRemovalCharge';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultKeysLimit';
    readonly inputs: readonly [
      {
        readonly name: 'limit';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultMaxWithdrawalRequestFee';
    readonly inputs: readonly [
      {
        readonly name: 'fee';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultPerformanceCoefficients';
    readonly inputs: readonly [
      {
        readonly name: 'attestationsWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'blocksWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'syncWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultPerformanceLeeway';
    readonly inputs: readonly [
      {
        readonly name: 'leeway';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultQueueConfig';
    readonly inputs: readonly [
      {
        readonly name: 'priority';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'maxDeposits';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultRewardShare';
    readonly inputs: readonly [
      {
        readonly name: 'share';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setDefaultStrikesParams';
    readonly inputs: readonly [
      {
        readonly name: 'lifetime';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'threshold';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setElRewardsStealingAdditionalFine';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'fine';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setExitDelayPenalty';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setKeyRemovalCharge';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'keyRemovalCharge';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setKeysLimit';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'limit';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setMaxWithdrawalRequestFee';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'fee';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setPerformanceCoefficients';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'attestationsWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'blocksWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'syncWeight';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setPerformanceLeewayData';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'data';
        readonly type: 'tuple[]';
        readonly internalType: 'struct ICSParametersRegistry.KeyNumberValueInterval[]';
        readonly components: readonly [
          {
            readonly name: 'minKeyNumber';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'value';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setQueueConfig';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'priority';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'maxDeposits';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setRewardShareData';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'data';
        readonly type: 'tuple[]';
        readonly internalType: 'struct ICSParametersRegistry.KeyNumberValueInterval[]';
        readonly components: readonly [
          {
            readonly name: 'minKeyNumber';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'value';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'setStrikesParams';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'lifetime';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'threshold';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'supportsInterface';
    readonly inputs: readonly [
      {
        readonly name: 'interfaceId';
        readonly type: 'bytes4';
        readonly internalType: 'bytes4';
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
    readonly name: 'unsetAllowedExitDelay';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetBadPerformancePenalty';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetElRewardsStealingAdditionalFine';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetExitDelayPenalty';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetKeyRemovalCharge';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetKeysLimit';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetMaxWithdrawalRequestFee';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetPerformanceCoefficients';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetPerformanceLeewayData';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetQueueConfig';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetRewardShareData';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'unsetStrikesParams';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'event';
    readonly name: 'AllowedExitDelaySet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'delay';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'AllowedExitDelayUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'BadPerformancePenaltySet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'BadPerformancePenaltyUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultAllowedExitDelaySet';
    readonly inputs: readonly [
      {
        readonly name: 'delay';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultBadPerformancePenaltySet';
    readonly inputs: readonly [
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultElRewardsStealingAdditionalFineSet';
    readonly inputs: readonly [
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultExitDelayPenaltySet';
    readonly inputs: readonly [
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultKeyRemovalChargeSet';
    readonly inputs: readonly [
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultKeysLimitSet';
    readonly inputs: readonly [
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultMaxWithdrawalRequestFeeSet';
    readonly inputs: readonly [
      {
        readonly name: 'fee';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultPerformanceCoefficientsSet';
    readonly inputs: readonly [
      {
        readonly name: 'attestationsWeight';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'blocksWeight';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'syncWeight';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultPerformanceLeewaySet';
    readonly inputs: readonly [
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultQueueConfigSet';
    readonly inputs: readonly [
      {
        readonly name: 'priority';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'maxDeposits';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultRewardShareSet';
    readonly inputs: readonly [
      {
        readonly name: 'value';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DefaultStrikesParamsSet';
    readonly inputs: readonly [
      {
        readonly name: 'lifetime';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'threshold';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ElRewardsStealingAdditionalFineSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'fine';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ElRewardsStealingAdditionalFineUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ExitDelayPenaltySet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'penalty';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ExitDelayPenaltyUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'Initialized';
    readonly inputs: readonly [
      {
        readonly name: 'version';
        readonly type: 'uint64';
        readonly indexed: false;
        readonly internalType: 'uint64';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'KeyRemovalChargeSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'keyRemovalCharge';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'KeyRemovalChargeUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'KeysLimitSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'limit';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'KeysLimitUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'MaxWithdrawalRequestFeeSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'fee';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'MaxWithdrawalRequestFeeUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'PerformanceCoefficientsSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'attestationsWeight';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'blocksWeight';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'syncWeight';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'PerformanceCoefficientsUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'PerformanceLeewayDataSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'data';
        readonly type: 'tuple[]';
        readonly indexed: false;
        readonly internalType: 'struct ICSParametersRegistry.KeyNumberValueInterval[]';
        readonly components: readonly [
          {
            readonly name: 'minKeyNumber';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'value';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'PerformanceLeewayDataUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'QueueConfigSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'priority';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'maxDeposits';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'QueueConfigUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RewardShareDataSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'data';
        readonly type: 'tuple[]';
        readonly indexed: false;
        readonly internalType: 'struct ICSParametersRegistry.KeyNumberValueInterval[]';
        readonly components: readonly [
          {
            readonly name: 'minKeyNumber';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'value';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
        ];
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RewardShareDataUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RoleAdminChanged';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly indexed: true;
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'previousAdminRole';
        readonly type: 'bytes32';
        readonly indexed: true;
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'newAdminRole';
        readonly type: 'bytes32';
        readonly indexed: true;
        readonly internalType: 'bytes32';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RoleGranted';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly indexed: true;
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'account';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'sender';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RoleRevoked';
    readonly inputs: readonly [
      {
        readonly name: 'role';
        readonly type: 'bytes32';
        readonly indexed: true;
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'account';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'sender';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'StrikesParamsSet';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'lifetime';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'threshold';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'StrikesParamsUnset';
    readonly inputs: readonly [
      {
        readonly name: 'curveId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'error';
    readonly name: 'AccessControlBadConfirmation';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'AccessControlUnauthorizedAccount';
    readonly inputs: readonly [
      {
        readonly name: 'account';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'neededRole';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
    ];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidAllowedExitDelay';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidInitialization';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidKeyNumberValueIntervals';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidPerformanceCoefficients';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidPerformanceLeewayData';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidRewardShareData';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidStrikesParams';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'NotInitializing';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'QueueCannotBeUsed';
    readonly inputs: readonly [];
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
    readonly name: 'ZeroAdminAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroMaxDeposits';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroQueueLowestPriority';
    readonly inputs: readonly [];
  },
];
//# sourceMappingURL=CSParametersRegistry.d.ts.map
