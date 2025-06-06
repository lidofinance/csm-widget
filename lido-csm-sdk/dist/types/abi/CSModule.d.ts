export declare const CSModuleAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "moduleType";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "lidoLocator";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "parametersRegistry";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_accounting";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "exitPenalties";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "ACCOUNTING";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSAccounting";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "CREATE_NODE_OPERATOR_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DEFAULT_ADMIN_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DEPOSIT_SIZE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "EXIT_PENALTIES";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSExitPenalties";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "FEE_DISTRIBUTOR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "LIDO_LOCATOR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ILidoLocator";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PARAMETERS_REGISTRY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSParametersRegistry";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PAUSE_INFINITELY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PAUSE_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "QUEUE_LEGACY_PRIORITY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "QUEUE_LOWEST_PRIORITY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RECOVERER_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "REPORT_EL_REWARDS_STEALING_PENALTY_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RESUME_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "SETTLE_EL_REWARDS_STEALING_PENALTY_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "STAKING_ROUTER_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "STETH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IStETH";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERIFIER_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "accounting";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSAccounting";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addValidatorKeysETH";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "publicKeys";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "signatures";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addValidatorKeysStETH";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "publicKeys";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "signatures";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "permit";
        readonly type: "tuple";
        readonly internalType: "struct ICSAccounting.PermitInput";
        readonly components: readonly [{
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "v";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "r";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "s";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "addValidatorKeysWstETH";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "publicKeys";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "signatures";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "permit";
        readonly type: "tuple";
        readonly internalType: "struct ICSAccounting.PermitInput";
        readonly components: readonly [{
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "v";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "r";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "s";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "cancelELRewardsStealingPenalty";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "changeNodeOperatorRewardAddress";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "newAddress";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "cleanDepositQueue";
    readonly inputs: readonly [{
        readonly name: "maxItems";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "removed";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "lastRemovedAtDepth";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "compensateELRewardsStealingPenalty";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "confirmNodeOperatorManagerAddressChange";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "confirmNodeOperatorRewardAddressChange";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "createNodeOperator";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "managementProperties";
        readonly type: "tuple";
        readonly internalType: "struct NodeOperatorManagementProperties";
        readonly components: readonly [{
            readonly name: "managerAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "rewardAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "extendedManagerPermissions";
            readonly type: "bool";
            readonly internalType: "bool";
        }];
    }, {
        readonly name: "referrer";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "decreaseVettedSigningKeysCount";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorIds";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "vettedSigningKeysCounts";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "depositQueueItem";
    readonly inputs: readonly [{
        readonly name: "queuePriority";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "index";
        readonly type: "uint128";
        readonly internalType: "uint128";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "Batch";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "depositQueuePointers";
    readonly inputs: readonly [{
        readonly name: "queuePriority";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "head";
        readonly type: "uint128";
        readonly internalType: "uint128";
    }, {
        readonly name: "tail";
        readonly type: "uint128";
        readonly internalType: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "exitDeadlineThreshold";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "finalizeUpgradeV2";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getActiveNodeOperatorsCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitializedVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperator";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct NodeOperator";
        readonly components: readonly [{
            readonly name: "totalAddedKeys";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "totalWithdrawnKeys";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "totalDepositedKeys";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "totalVettedKeys";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "stuckValidatorsCount";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "depositableValidatorsCount";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "targetLimit";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "targetLimitMode";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "totalExitedKeys";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "enqueuedCount";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "managerAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "proposedManagerAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "rewardAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "proposedRewardAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "extendedManagerPermissions";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "usedPriorityQueue";
            readonly type: "bool";
            readonly internalType: "bool";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorIds";
    readonly inputs: readonly [{
        readonly name: "offset";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "limit";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "nodeOperatorIds";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorIsActive";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorManagementProperties";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct NodeOperatorManagementProperties";
        readonly components: readonly [{
            readonly name: "managerAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "rewardAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "extendedManagerPermissions";
            readonly type: "bool";
            readonly internalType: "bool";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorNonWithdrawnKeys";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorOwner";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorSummary";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "targetLimitMode";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "targetValidatorsCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "stuckValidatorsCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "refundedValidatorsCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "stuckPenaltyEndTimestamp";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "totalExitedValidators";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "totalDepositedValidators";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "depositableValidatorsCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorTotalDepositedKeys";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "totalDepositedKeys";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNodeOperatorsCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getResumeSinceTimestamp";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getRoleAdmin";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getRoleMember";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "index";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getRoleMemberCount";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigningKeys";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "startIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSigningKeysWithSignatures";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "startIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "keys";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "signatures";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getStakingModuleSummary";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "totalExitedValidators";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "totalDepositedValidators";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "depositableValidatorsCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getType";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "grantRole";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "hasRole";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "admin";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "isPaused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidatorExitDelayPenaltyApplicable";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "publicKey";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "eligibleToExitInSec";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isValidatorWithdrawn";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keyIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "migrateToPriorityQueue";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "obtainDepositData";
    readonly inputs: readonly [{
        readonly name: "depositsCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "publicKeys";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "signatures";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "onExitedAndStuckValidatorsCountsUpdated";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "onRewardsMinted";
    readonly inputs: readonly [{
        readonly name: "totalShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "onValidatorExitTriggered";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "publicKey";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "withdrawalRequestPaidFee";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "exitType";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "onWithdrawalCredentialsChanged";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "pauseFor";
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "proposeNodeOperatorManagerAddressChange";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedAddress";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "proposeNodeOperatorRewardAddressChange";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedAddress";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "recoverERC1155";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "recoverERC20";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "recoverERC721";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "recoverEther";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "removeKeys";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "startIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "renounceRole";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "callerConfirmation";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reportELRewardsStealingPenalty";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "blockHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "reportValidatorExitDelay";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "publicKey";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "eligibleToExitInSec";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "resetNodeOperatorManagerAddress";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "resume";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "revokeRole";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settleELRewardsStealingPenalty";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorIds";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "submitWithdrawals";
    readonly inputs: readonly [{
        readonly name: "withdrawalsInfo";
        readonly type: "tuple[]";
        readonly internalType: "struct ValidatorWithdrawalInfo[]";
        readonly components: readonly [{
            readonly name: "nodeOperatorId";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "keyIndex";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "amount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "isSlashed";
            readonly type: "bool";
            readonly internalType: "bool";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "supportsInterface";
    readonly inputs: readonly [{
        readonly name: "interfaceId";
        readonly type: "bytes4";
        readonly internalType: "bytes4";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "unsafeUpdateValidatorsCount";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "exitedValidatorsKeysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateDepositableValidatorsCount";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateExitedValidatorsCount";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorIds";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "exitedValidatorsCounts";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "updateTargetValidatorsLimits";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "targetLimitMode";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "targetLimit";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "BatchEnqueued";
    readonly inputs: readonly [{
        readonly name: "queuePriority";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "count";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "DepositableSigningKeysCountChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "depositableKeysCount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "DepositedSigningKeysCountChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "depositedKeysCount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ELRewardsStealingPenaltyCancelled";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ELRewardsStealingPenaltyCompensated";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ELRewardsStealingPenaltyReported";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedBlockHash";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }, {
        readonly name: "stolenAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ELRewardsStealingPenaltySettled";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC1155Recovered";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC20Recovered";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC721Recovered";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EtherRecovered";
    readonly inputs: readonly [{
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ExitedSigningKeysCountChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "exitedKeysCount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint64";
        readonly indexed: false;
        readonly internalType: "uint64";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "KeyRemovalChargeApplied";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "NodeOperatorAdded";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "managerAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "rewardAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "extendedManagerPermissions";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "NodeOperatorManagerAddressChangeProposed";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "oldProposedAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newProposedAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "NodeOperatorManagerAddressChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "oldAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "NodeOperatorRewardAddressChangeProposed";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "oldProposedAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newProposedAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "NodeOperatorRewardAddressChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "oldAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newAddress";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "NonceChanged";
    readonly inputs: readonly [{
        readonly name: "nonce";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Paused";
    readonly inputs: readonly [{
        readonly name: "duration";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReferrerSet";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "referrer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Resumed";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RoleAdminChanged";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "previousAdminRole";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "newAdminRole";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RoleGranted";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RoleRevoked";
    readonly inputs: readonly [{
        readonly name: "role";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "account";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SigningKeyAdded";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "pubkey";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SigningKeyRemoved";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "pubkey";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "StETHSharesRecovered";
    readonly inputs: readonly [{
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "shares";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TargetValidatorsCountChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "targetLimitMode";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "targetValidatorsCount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TotalSigningKeysCountChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "totalKeysCount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "VettedSigningKeysCountChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "vettedKeysCount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "VettedSigningKeysCountDecreased";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "WithdrawalSubmitted";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "keyIndex";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "pubkey";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AccessControlBadConfirmation";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AccessControlUnauthorizedAccount";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "neededRole";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "AlreadyProposed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadyWithdrawn";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "CannotAddKeys";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EmptyKey";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExitedKeysDecrease";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ExitedKeysHigherThanTotalDeposited";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedToSendEther";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidAmount";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInput";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidKeysCount";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidLength";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidReportData";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidVetKeysPointer";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "KeysLimitExceeded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "MethodCallIsNotAllowed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NodeOperatorDoesNotExist";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotAllowedToRecover";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotEnoughKeys";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PauseUntilMustBeInFuture";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PausedExpected";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PriorityQueueAlreadyUsed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "QueueIsEmpty";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "QueueLookupNoLimit";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ResumedExpected";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SameAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotEligible";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotManagerAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotProposedAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotRewardAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SigningKeysInvalidOffset";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroAccountingAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroAdminAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroExitPenaltiesAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroLocatorAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroParametersRegistryAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroPauseDuration";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroRewardAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroSenderAddress";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=CSModule.d.ts.map