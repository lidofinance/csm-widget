export declare const CSStrikesAbi: readonly [
  {
    readonly type: 'constructor';
    readonly inputs: readonly [
      {
        readonly name: 'module';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'oracle';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'exitPenalties';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'parametersRegistry';
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
    readonly name: 'EXIT_PENALTIES';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'contract ICSExitPenalties';
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
    readonly name: 'ORACLE';
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
    readonly name: 'ejector';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'contract ICSEjector';
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
    readonly name: 'hashLeaf';
    readonly inputs: readonly [
      {
        readonly name: 'keyStrikes';
        readonly type: 'tuple';
        readonly internalType: 'struct ICSStrikes.KeyStrikes';
        readonly components: readonly [
          {
            readonly name: 'nodeOperatorId';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'keyIndex';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'data';
            readonly type: 'uint256[]';
            readonly internalType: 'uint256[]';
          },
        ];
      },
      {
        readonly name: 'pubkey';
        readonly type: 'bytes';
        readonly internalType: 'bytes';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
    ];
    readonly stateMutability: 'pure';
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
        readonly name: '_ejector';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'processBadPerformanceProof';
    readonly inputs: readonly [
      {
        readonly name: 'keyStrikesList';
        readonly type: 'tuple[]';
        readonly internalType: 'struct ICSStrikes.KeyStrikes[]';
        readonly components: readonly [
          {
            readonly name: 'nodeOperatorId';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'keyIndex';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'data';
            readonly type: 'uint256[]';
            readonly internalType: 'uint256[]';
          },
        ];
      },
      {
        readonly name: 'proof';
        readonly type: 'bytes32[]';
        readonly internalType: 'bytes32[]';
      },
      {
        readonly name: 'proofFlags';
        readonly type: 'bool[]';
        readonly internalType: 'bool[]';
      },
      {
        readonly name: 'refundRecipient';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'payable';
  },
  {
    readonly type: 'function';
    readonly name: 'processOracleReport';
    readonly inputs: readonly [
      {
        readonly name: '_treeRoot';
        readonly type: 'bytes32';
        readonly internalType: 'bytes32';
      },
      {
        readonly name: '_treeCid';
        readonly type: 'string';
        readonly internalType: 'string';
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
    readonly name: 'setEjector';
    readonly inputs: readonly [
      {
        readonly name: '_ejector';
        readonly type: 'address';
        readonly internalType: 'address';
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
    readonly name: 'treeCid';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'string';
        readonly internalType: 'string';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'treeRoot';
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
    readonly name: 'verifyProof';
    readonly inputs: readonly [
      {
        readonly name: 'keyStrikesList';
        readonly type: 'tuple[]';
        readonly internalType: 'struct ICSStrikes.KeyStrikes[]';
        readonly components: readonly [
          {
            readonly name: 'nodeOperatorId';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'keyIndex';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'data';
            readonly type: 'uint256[]';
            readonly internalType: 'uint256[]';
          },
        ];
      },
      {
        readonly name: 'pubkeys';
        readonly type: 'bytes[]';
        readonly internalType: 'bytes[]';
      },
      {
        readonly name: 'proof';
        readonly type: 'bytes32[]';
        readonly internalType: 'bytes32[]';
      },
      {
        readonly name: 'proofFlags';
        readonly type: 'bool[]';
        readonly internalType: 'bool[]';
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
    readonly type: 'event';
    readonly name: 'EjectorSet';
    readonly inputs: readonly [
      {
        readonly name: 'ejector';
        readonly type: 'address';
        readonly indexed: false;
        readonly internalType: 'address';
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
    readonly name: 'StrikesDataUpdated';
    readonly inputs: readonly [
      {
        readonly name: 'treeRoot';
        readonly type: 'bytes32';
        readonly indexed: false;
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'treeCid';
        readonly type: 'string';
        readonly indexed: false;
        readonly internalType: 'string';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'StrikesDataWiped';
    readonly inputs: readonly [];
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
    readonly name: 'InvalidInitialization';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidProof';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidReportData';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'MerkleProofInvalidMultiproof';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'NotEnoughStrikesToEject';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'NotInitializing';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'SenderIsNotOracle';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ValueNotEvenlyDivisible';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroAdminAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroEjectorAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroExitPenaltiesAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroModuleAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroOracleAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroParametersRegistryAddress';
    readonly inputs: readonly [];
  },
];
//# sourceMappingURL=CSStrikes.d.ts.map
