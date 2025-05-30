export declare const CSFeeDistributorAbi: readonly [
  {
    readonly type: 'constructor';
    readonly inputs: readonly [
      {
        readonly name: 'stETH';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'accounting';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'oracle';
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
        readonly internalType: 'address';
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
    readonly name: 'RECOVERER_ROLE';
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
    readonly name: 'STETH';
    readonly inputs: readonly [];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'address';
        readonly internalType: 'contract IStETH';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'distributeFees';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'cumulativeFeeShares';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'proof';
        readonly type: 'bytes32[]';
        readonly internalType: 'bytes32[]';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'sharesToDistribute';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'distributedShares';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'distributed';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'distributionDataHistoryCount';
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
    readonly name: 'finalizeUpgradeV2';
    readonly inputs: readonly [
      {
        readonly name: '_rebateRecipient';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'getFeesToDistribute';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'cumulativeFeeShares';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'proof';
        readonly type: 'bytes32[]';
        readonly internalType: 'bytes32[]';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: 'sharesToDistribute';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly stateMutability: 'view';
  },
  {
    readonly type: 'function';
    readonly name: 'getHistoricalDistributionData';
    readonly inputs: readonly [
      {
        readonly name: 'index';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly type: 'tuple';
        readonly internalType: 'struct ICSFeeDistributor.DistributionData';
        readonly components: readonly [
          {
            readonly name: 'refSlot';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'treeRoot';
            readonly type: 'bytes32';
            readonly internalType: 'bytes32';
          },
          {
            readonly name: 'treeCid';
            readonly type: 'string';
            readonly internalType: 'string';
          },
          {
            readonly name: 'logCid';
            readonly type: 'string';
            readonly internalType: 'string';
          },
          {
            readonly name: 'distributed';
            readonly type: 'uint256';
            readonly internalType: 'uint256';
          },
          {
            readonly name: 'rebate';
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
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'shares';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
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
        readonly name: '_rebateRecipient';
        readonly type: 'address';
        readonly internalType: 'address';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'logCid';
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
    readonly name: 'pendingSharesToDistribute';
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
      {
        readonly name: '_logCid';
        readonly type: 'string';
        readonly internalType: 'string';
      },
      {
        readonly name: 'distributed';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'rebate';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'refSlot';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'rebateRecipient';
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
    readonly name: 'recoverERC1155';
    readonly inputs: readonly [
      {
        readonly name: 'token';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'tokenId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'recoverERC20';
    readonly inputs: readonly [
      {
        readonly name: 'token';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'amount';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'recoverERC721';
    readonly inputs: readonly [
      {
        readonly name: 'token';
        readonly type: 'address';
        readonly internalType: 'address';
      },
      {
        readonly name: 'tokenId';
        readonly type: 'uint256';
        readonly internalType: 'uint256';
      },
    ];
    readonly outputs: readonly [];
    readonly stateMutability: 'nonpayable';
  },
  {
    readonly type: 'function';
    readonly name: 'recoverEther';
    readonly inputs: readonly [];
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
    readonly name: 'setRebateRecipient';
    readonly inputs: readonly [
      {
        readonly name: '_rebateRecipient';
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
    readonly name: 'totalClaimableShares';
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
    readonly type: 'event';
    readonly name: 'DistributionDataUpdated';
    readonly inputs: readonly [
      {
        readonly name: 'totalClaimableShares';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
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
    readonly name: 'DistributionLogUpdated';
    readonly inputs: readonly [
      {
        readonly name: 'logCid';
        readonly type: 'string';
        readonly indexed: false;
        readonly internalType: 'string';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ERC1155Recovered';
    readonly inputs: readonly [
      {
        readonly name: 'token';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'tokenId';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'recipient';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'amount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ERC20Recovered';
    readonly inputs: readonly [
      {
        readonly name: 'token';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'recipient';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'amount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ERC721Recovered';
    readonly inputs: readonly [
      {
        readonly name: 'token';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'tokenId';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'recipient';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'EtherRecovered';
    readonly inputs: readonly [
      {
        readonly name: 'recipient';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'amount';
        readonly type: 'uint256';
        readonly indexed: false;
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
    readonly name: 'ModuleFeeDistributed';
    readonly inputs: readonly [
      {
        readonly name: 'shares';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'OperatorFeeDistributed';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'shares';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RebateRecipientSet';
    readonly inputs: readonly [
      {
        readonly name: 'recipient';
        readonly type: 'address';
        readonly indexed: false;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'RebateTransferred';
    readonly inputs: readonly [
      {
        readonly name: 'shares';
        readonly type: 'uint256';
        readonly indexed: false;
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
    readonly name: 'StETHSharesRecovered';
    readonly inputs: readonly [
      {
        readonly name: 'recipient';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'shares';
        readonly type: 'uint256';
        readonly indexed: false;
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
    readonly name: 'FailedToSendEther';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'FeeSharesDecrease';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidInitialization';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidLogCID';
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
    readonly name: 'InvalidShares';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidTreeCid';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'InvalidTreeRoot';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'NotAllowedToRecover';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'NotEnoughShares';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'NotInitializing';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'SenderIsNotAccounting';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'SenderIsNotOracle';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroAccountingAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroAdminAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroOracleAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroRebateRecipientAddress';
    readonly inputs: readonly [];
  },
  {
    readonly type: 'error';
    readonly name: 'ZeroStEthAddress';
    readonly inputs: readonly [];
  },
];
//# sourceMappingURL=CSFeeDistributor.d.ts.map
