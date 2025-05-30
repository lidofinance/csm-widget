export const CSModulev1EventsAbi = [
    {
        type: 'event',
        name: 'BatchEnqueued',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'count',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'DepositableSigningKeysCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'depositableKeysCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'DepositedSigningKeysCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'depositedKeysCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ELRewardsStealingPenaltyCancelled',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ELRewardsStealingPenaltyCompensated',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ELRewardsStealingPenaltyReported',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'proposedBlockHash',
                type: 'bytes32',
                indexed: false,
                internalType: 'bytes32',
            },
            {
                name: 'stolenAmount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ELRewardsStealingPenaltySettled',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ERC1155Recovered',
        inputs: [
            {
                name: 'token',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'recipient',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ERC20Recovered',
        inputs: [
            {
                name: 'token',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'recipient',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ERC721Recovered',
        inputs: [
            {
                name: 'token',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'recipient',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'EtherRecovered',
        inputs: [
            {
                name: 'recipient',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ExitedSigningKeysCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'exitedKeysCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'InitialSlashingSubmitted',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'keyIndex',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'pubkey',
                type: 'bytes',
                indexed: false,
                internalType: 'bytes',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Initialized',
        inputs: [
            {
                name: 'version',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'KeyRemovalChargeApplied',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'KeyRemovalChargeSet',
        inputs: [
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'NodeOperatorAdded',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'managerAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'rewardAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'NodeOperatorManagerAddressChangeProposed',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'oldProposedAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newProposedAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'NodeOperatorManagerAddressChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'oldAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'NodeOperatorRewardAddressChangeProposed',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'oldProposedAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newProposedAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'NodeOperatorRewardAddressChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'oldAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newAddress',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'NonceChanged',
        inputs: [
            {
                name: 'nonce',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Paused',
        inputs: [
            {
                name: 'duration',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'PublicRelease',
        inputs: [],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ReferrerSet',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'referrer',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Resumed',
        inputs: [],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RoleAdminChanged',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'previousAdminRole',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'newAdminRole',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RoleGranted',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'sender',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RoleRevoked',
        inputs: [
            {
                name: 'role',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
            {
                name: 'account',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'sender',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'SigningKeyAdded',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'pubkey',
                type: 'bytes',
                indexed: false,
                internalType: 'bytes',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'SigningKeyRemoved',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'pubkey',
                type: 'bytes',
                indexed: false,
                internalType: 'bytes',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'StETHSharesRecovered',
        inputs: [
            {
                name: 'recipient',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'shares',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'StuckSigningKeysCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'stuckKeysCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'TargetValidatorsCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'targetLimitMode',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'targetValidatorsCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'TotalSigningKeysCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'totalKeysCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'VettedSigningKeysCountChanged',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'vettedKeysCount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'VettedSigningKeysCountDecreased',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'WithdrawalSubmitted',
        inputs: [
            {
                name: 'nodeOperatorId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'keyIndex',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'pubkey',
                type: 'bytes',
                indexed: false,
                internalType: 'bytes',
            },
        ],
        anonymous: false,
    },
];
//# sourceMappingURL=CSModuleV1Events.js.map