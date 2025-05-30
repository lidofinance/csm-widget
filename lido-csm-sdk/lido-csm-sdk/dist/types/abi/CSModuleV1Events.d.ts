export declare const CSModulev1EventsAbi: readonly [
  {
    readonly type: 'event';
    readonly name: 'BatchEnqueued';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'count';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DepositableSigningKeysCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'depositableKeysCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'DepositedSigningKeysCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'depositedKeysCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ELRewardsStealingPenaltyCancelled';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
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
    readonly name: 'ELRewardsStealingPenaltyCompensated';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
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
    readonly name: 'ELRewardsStealingPenaltyReported';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'proposedBlockHash';
        readonly type: 'bytes32';
        readonly indexed: false;
        readonly internalType: 'bytes32';
      },
      {
        readonly name: 'stolenAmount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ELRewardsStealingPenaltySettled';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
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
    readonly name: 'ExitedSigningKeysCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'exitedKeysCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'InitialSlashingSubmitted';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'keyIndex';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'pubkey';
        readonly type: 'bytes';
        readonly indexed: false;
        readonly internalType: 'bytes';
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
    readonly name: 'KeyRemovalChargeApplied';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'KeyRemovalChargeSet';
    readonly inputs: readonly [
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
    readonly name: 'NodeOperatorAdded';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'managerAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'rewardAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'NodeOperatorManagerAddressChangeProposed';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'oldProposedAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'newProposedAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'NodeOperatorManagerAddressChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'oldAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'newAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'NodeOperatorRewardAddressChangeProposed';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'oldProposedAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'newProposedAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'NodeOperatorRewardAddressChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'oldAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
      {
        readonly name: 'newAddress';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'NonceChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nonce';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'Paused';
    readonly inputs: readonly [
      {
        readonly name: 'duration';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'PublicRelease';
    readonly inputs: readonly [];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'ReferrerSet';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'referrer';
        readonly type: 'address';
        readonly indexed: true;
        readonly internalType: 'address';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'Resumed';
    readonly inputs: readonly [];
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
    readonly name: 'SigningKeyAdded';
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
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'SigningKeyRemoved';
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
    readonly type: 'event';
    readonly name: 'StuckSigningKeysCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'stuckKeysCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'TargetValidatorsCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'targetLimitMode';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'targetValidatorsCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'TotalSigningKeysCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'totalKeysCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'VettedSigningKeysCountChanged';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'vettedKeysCount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'VettedSigningKeysCountDecreased';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
    ];
    readonly anonymous: false;
  },
  {
    readonly type: 'event';
    readonly name: 'WithdrawalSubmitted';
    readonly inputs: readonly [
      {
        readonly name: 'nodeOperatorId';
        readonly type: 'uint256';
        readonly indexed: true;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'keyIndex';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'amount';
        readonly type: 'uint256';
        readonly indexed: false;
        readonly internalType: 'uint256';
      },
      {
        readonly name: 'pubkey';
        readonly type: 'bytes';
        readonly indexed: false;
        readonly internalType: 'bytes';
      },
    ];
    readonly anonymous: false;
  },
];
//# sourceMappingURL=CSModuleV1Events.d.ts.map
