export declare const StakingRouterAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_depositContract";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AppAuthLidoFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "firstArrayLength";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "secondArrayLength";
        readonly type: "uint256";
    }];
    readonly name: "ArraysLengthMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "DepositContractZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "DirectETHTransfer";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "EmptyWithdrawalsCredentials";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ExitedValidatorsCountCannotDecrease";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidContractVersionIncrement";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "etherValue";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "depositsCount";
        readonly type: "uint256";
    }];
    readonly name: "InvalidDepositsValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidFeeSum";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidMaxDepositPerBlockValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidMinDepositBlockDistance";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidPriorityExitShareThreshold";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "actual";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "expected";
        readonly type: "uint256";
    }];
    readonly name: "InvalidPublicKeysBatchLength";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "code";
        readonly type: "uint256";
    }];
    readonly name: "InvalidReportData";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "actual";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "expected";
        readonly type: "uint256";
    }];
    readonly name: "InvalidSignaturesBatchLength";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidStakeShareLimit";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NonZeroContractVersionOnInit";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "reportedExitedValidatorsCount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "depositedValidatorsCount";
        readonly type: "uint256";
    }];
    readonly name: "ReportedExitedValidatorsExceedDeposited";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingModuleAddressExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingModuleNotActive";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingModuleStatusTheSame";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingModuleUnregistered";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingModuleWrongName";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingModulesLimitExceeded";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "expected";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "received";
        readonly type: "uint256";
    }];
    readonly name: "UnexpectedContractVersion";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "currentModuleExitedValidatorsCount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "currentNodeOpExitedValidatorsCount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "currentNodeOpStuckValidatorsCount";
        readonly type: "uint256";
    }];
    readonly name: "UnexpectedCurrentValidatorsCount";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "newModuleTotalExitedValidatorsCount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "newModuleTotalExitedValidatorsCountInStakingRouter";
        readonly type: "uint256";
    }];
    readonly name: "UnexpectedFinalExitedValidatorsCount";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnrecoverableModuleError";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ZeroAddressAdmin";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ZeroAddressLido";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ZeroAddressStakingModule";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "version";
        readonly type: "uint256";
    }];
    readonly name: "ContractVersionSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "lowLevelRevertData";
        readonly type: "bytes";
    }];
    readonly name: "ExitedAndStuckValidatorsCountsUpdateFailed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "lowLevelRevertData";
        readonly type: "bytes";
    }];
    readonly name: "RewardsMintedReportFailed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "previousAdminRole";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "newAdminRole";
        readonly type: "bytes32";
    }];
    readonly name: "RoleAdminChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "RoleGranted";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "RoleRevoked";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "stakingModule";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "createdBy";
        readonly type: "address";
    }];
    readonly name: "StakingModuleAdded";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "unreportedExitedValidatorsCount";
        readonly type: "uint256";
    }];
    readonly name: "StakingModuleExitedValidatorsIncompleteReporting";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "stakingModuleFee";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "treasuryFee";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "setBy";
        readonly type: "address";
    }];
    readonly name: "StakingModuleFeesSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "maxDepositsPerBlock";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "setBy";
        readonly type: "address";
    }];
    readonly name: "StakingModuleMaxDepositsPerBlockSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "minDepositBlockDistance";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "setBy";
        readonly type: "address";
    }];
    readonly name: "StakingModuleMinDepositBlockDistanceSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "stakeShareLimit";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "priorityExitShareThreshold";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "setBy";
        readonly type: "address";
    }];
    readonly name: "StakingModuleShareLimitSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "enum StakingRouter.StakingModuleStatus";
        readonly name: "status";
        readonly type: "uint8";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "setBy";
        readonly type: "address";
    }];
    readonly name: "StakingModuleStatusSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "StakingRouterETHDeposited";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "withdrawalCredentials";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "setBy";
        readonly type: "address";
    }];
    readonly name: "WithdrawalCredentialsSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "lowLevelRevertData";
        readonly type: "bytes";
    }];
    readonly name: "WithdrawalsCredentialsChangeFailed";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "DEFAULT_ADMIN_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "DEPOSIT_CONTRACT";
    readonly outputs: readonly [{
        readonly internalType: "contract IDepositContract";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "FEE_PRECISION_POINTS";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MANAGE_WITHDRAWAL_CREDENTIALS_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MAX_STAKING_MODULES_COUNT";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MAX_STAKING_MODULE_NAME_LENGTH";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "REPORT_EXITED_VALIDATORS_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "REPORT_REWARDS_MINTED_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "STAKING_MODULE_MANAGE_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "STAKING_MODULE_UNVETTING_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "TOTAL_BASIS_POINTS";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "UNSAFE_SET_EXITED_VALIDATORS_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "_name";
        readonly type: "string";
    }, {
        readonly internalType: "address";
        readonly name: "_stakingModuleAddress";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_stakeShareLimit";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_priorityExitShareThreshold";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_stakingModuleFee";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_treasuryFee";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_maxDepositsPerBlock";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_minDepositBlockDistance";
        readonly type: "uint256";
    }];
    readonly name: "addStakingModule";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "_nodeOperatorIds";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes";
        readonly name: "_vettedSigningKeysCounts";
        readonly type: "bytes";
    }];
    readonly name: "decreaseStakingModuleVettedKeysCountByNodeOperator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_depositsCount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "_depositCalldata";
        readonly type: "bytes";
    }];
    readonly name: "deposit";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "_priorityExitShareThresholds";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "_maxDepositsPerBlock";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "_minDepositBlockDistances";
        readonly type: "uint256[]";
    }];
    readonly name: "finalizeUpgrade_v2";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getAllNodeOperatorDigests";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "isActive";
            readonly type: "bool";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "targetLimitMode";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "targetValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "stuckValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "refundedValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "stuckPenaltyEndTimestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalExitedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalDepositedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "depositableValidatorsCount";
                readonly type: "uint256";
            }];
            readonly internalType: "struct StakingRouter.NodeOperatorSummary";
            readonly name: "summary";
            readonly type: "tuple";
        }];
        readonly internalType: "struct StakingRouter.NodeOperatorDigest[]";
        readonly name: "";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getAllStakingModuleDigests";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "nodeOperatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "activeNodeOperatorsCount";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint24";
                readonly name: "id";
                readonly type: "uint24";
            }, {
                readonly internalType: "address";
                readonly name: "stakingModuleAddress";
                readonly type: "address";
            }, {
                readonly internalType: "uint16";
                readonly name: "stakingModuleFee";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint16";
                readonly name: "treasuryFee";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint16";
                readonly name: "stakeShareLimit";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "status";
                readonly type: "uint8";
            }, {
                readonly internalType: "string";
                readonly name: "name";
                readonly type: "string";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastDepositAt";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint256";
                readonly name: "lastDepositBlock";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "exitedValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint16";
                readonly name: "priorityExitShareThreshold";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint64";
                readonly name: "maxDepositsPerBlock";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "minDepositBlockDistance";
                readonly type: "uint64";
            }];
            readonly internalType: "struct StakingRouter.StakingModule";
            readonly name: "state";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "totalExitedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalDepositedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "depositableValidatorsCount";
                readonly type: "uint256";
            }];
            readonly internalType: "struct StakingRouter.StakingModuleSummary";
            readonly name: "summary";
            readonly type: "tuple";
        }];
        readonly internalType: "struct StakingRouter.StakingModuleDigest[]";
        readonly name: "";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getContractVersion";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_depositsCount";
        readonly type: "uint256";
    }];
    readonly name: "getDepositsAllocation";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "allocated";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "allocations";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getLido";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "_nodeOperatorIds";
        readonly type: "uint256[]";
    }];
    readonly name: "getNodeOperatorDigests";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "isActive";
            readonly type: "bool";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "targetLimitMode";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "targetValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "stuckValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "refundedValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "stuckPenaltyEndTimestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalExitedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalDepositedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "depositableValidatorsCount";
                readonly type: "uint256";
            }];
            readonly internalType: "struct StakingRouter.NodeOperatorSummary";
            readonly name: "summary";
            readonly type: "tuple";
        }];
        readonly internalType: "struct StakingRouter.NodeOperatorDigest[]";
        readonly name: "digests";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_offset";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_limit";
        readonly type: "uint256";
    }];
    readonly name: "getNodeOperatorDigests";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "isActive";
            readonly type: "bool";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "targetLimitMode";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "targetValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "stuckValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "refundedValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "stuckPenaltyEndTimestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalExitedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalDepositedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "depositableValidatorsCount";
                readonly type: "uint256";
            }];
            readonly internalType: "struct StakingRouter.NodeOperatorSummary";
            readonly name: "summary";
            readonly type: "tuple";
        }];
        readonly internalType: "struct StakingRouter.NodeOperatorDigest[]";
        readonly name: "";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_nodeOperatorId";
        readonly type: "uint256";
    }];
    readonly name: "getNodeOperatorSummary";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "targetLimitMode";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "targetValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "stuckValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "refundedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "stuckPenaltyEndTimestamp";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "totalExitedValidators";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "totalDepositedValidators";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "depositableValidatorsCount";
            readonly type: "uint256";
        }];
        readonly internalType: "struct StakingRouter.NodeOperatorSummary";
        readonly name: "summary";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }];
    readonly name: "getRoleAdmin";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "index";
        readonly type: "uint256";
    }];
    readonly name: "getRoleMember";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }];
    readonly name: "getRoleMemberCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getStakingFeeAggregateDistribution";
    readonly outputs: readonly [{
        readonly internalType: "uint96";
        readonly name: "modulesFee";
        readonly type: "uint96";
    }, {
        readonly internalType: "uint96";
        readonly name: "treasuryFee";
        readonly type: "uint96";
    }, {
        readonly internalType: "uint256";
        readonly name: "basePrecision";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getStakingFeeAggregateDistributionE4Precision";
    readonly outputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "modulesFee";
        readonly type: "uint16";
    }, {
        readonly internalType: "uint16";
        readonly name: "treasuryFee";
        readonly type: "uint16";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModule";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "id";
            readonly type: "uint24";
        }, {
            readonly internalType: "address";
            readonly name: "stakingModuleAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint16";
            readonly name: "stakingModuleFee";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "treasuryFee";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "stakeShareLimit";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastDepositAt";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint256";
            readonly name: "lastDepositBlock";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "exitedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint16";
            readonly name: "priorityExitShareThreshold";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint64";
            readonly name: "maxDepositsPerBlock";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "minDepositBlockDistance";
            readonly type: "uint64";
        }];
        readonly internalType: "struct StakingRouter.StakingModule";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleActiveValidatorsCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "activeValidatorsCount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "_stakingModuleIds";
        readonly type: "uint256[]";
    }];
    readonly name: "getStakingModuleDigests";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "nodeOperatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "activeNodeOperatorsCount";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint24";
                readonly name: "id";
                readonly type: "uint24";
            }, {
                readonly internalType: "address";
                readonly name: "stakingModuleAddress";
                readonly type: "address";
            }, {
                readonly internalType: "uint16";
                readonly name: "stakingModuleFee";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint16";
                readonly name: "treasuryFee";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint16";
                readonly name: "stakeShareLimit";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "status";
                readonly type: "uint8";
            }, {
                readonly internalType: "string";
                readonly name: "name";
                readonly type: "string";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastDepositAt";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint256";
                readonly name: "lastDepositBlock";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "exitedValidatorsCount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint16";
                readonly name: "priorityExitShareThreshold";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint64";
                readonly name: "maxDepositsPerBlock";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "minDepositBlockDistance";
                readonly type: "uint64";
            }];
            readonly internalType: "struct StakingRouter.StakingModule";
            readonly name: "state";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256";
                readonly name: "totalExitedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "totalDepositedValidators";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "depositableValidatorsCount";
                readonly type: "uint256";
            }];
            readonly internalType: "struct StakingRouter.StakingModuleSummary";
            readonly name: "summary";
            readonly type: "tuple";
        }];
        readonly internalType: "struct StakingRouter.StakingModuleDigest[]";
        readonly name: "digests";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getStakingModuleIds";
    readonly outputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "stakingModuleIds";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleIsActive";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleIsDepositsPaused";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleIsStopped";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleLastDepositBlock";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_maxDepositsValue";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleMaxDepositsCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleMaxDepositsPerBlock";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleMinDepositBlockDistance";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleNonce";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleStatus";
    readonly outputs: readonly [{
        readonly internalType: "enum StakingRouter.StakingModuleStatus";
        readonly name: "";
        readonly type: "uint8";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "getStakingModuleSummary";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "totalExitedValidators";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "totalDepositedValidators";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "depositableValidatorsCount";
            readonly type: "uint256";
        }];
        readonly internalType: "struct StakingRouter.StakingModuleSummary";
        readonly name: "summary";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getStakingModules";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "id";
            readonly type: "uint24";
        }, {
            readonly internalType: "address";
            readonly name: "stakingModuleAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint16";
            readonly name: "stakingModuleFee";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "treasuryFee";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "stakeShareLimit";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastDepositAt";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint256";
            readonly name: "lastDepositBlock";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "exitedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint16";
            readonly name: "priorityExitShareThreshold";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint64";
            readonly name: "maxDepositsPerBlock";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "minDepositBlockDistance";
            readonly type: "uint64";
        }];
        readonly internalType: "struct StakingRouter.StakingModule[]";
        readonly name: "res";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getStakingModulesCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getStakingRewardsDistribution";
    readonly outputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "recipients";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "stakingModuleIds";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "uint96[]";
        readonly name: "stakingModuleFees";
        readonly type: "uint96[]";
    }, {
        readonly internalType: "uint96";
        readonly name: "totalFee";
        readonly type: "uint96";
    }, {
        readonly internalType: "uint256";
        readonly name: "precisionPoints";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getTotalFeeE4Precision";
    readonly outputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "totalFee";
        readonly type: "uint16";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getWithdrawalCredentials";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "grantRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "hasRole";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }];
    readonly name: "hasStakingModule";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_admin";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_lido";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_withdrawalCredentials";
        readonly type: "bytes32";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "onValidatorsCountsByNodeOperatorReportingFinished";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "renounceRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "_stakingModuleIds";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "_totalShares";
        readonly type: "uint256[]";
    }];
    readonly name: "reportRewardsMinted";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "_nodeOperatorIds";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes";
        readonly name: "_exitedValidatorsCounts";
        readonly type: "bytes";
    }];
    readonly name: "reportStakingModuleExitedValidatorsCountByNodeOperator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "_nodeOperatorIds";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes";
        readonly name: "_stuckValidatorsCounts";
        readonly type: "bytes";
    }];
    readonly name: "reportStakingModuleStuckValidatorsCountByNodeOperator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "revokeRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "enum StakingRouter.StakingModuleStatus";
        readonly name: "_status";
        readonly type: "uint8";
    }];
    readonly name: "setStakingModuleStatus";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "_withdrawalCredentials";
        readonly type: "bytes32";
    }];
    readonly name: "setWithdrawalCredentials";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceId";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_nodeOperatorId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bool";
        readonly name: "_triggerUpdateFinish";
        readonly type: "bool";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "currentModuleExitedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "currentNodeOperatorExitedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "currentNodeOperatorStuckValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "newModuleExitedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "newNodeOperatorExitedValidatorsCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "newNodeOperatorStuckValidatorsCount";
            readonly type: "uint256";
        }];
        readonly internalType: "struct StakingRouter.ValidatorsCountsCorrection";
        readonly name: "_correction";
        readonly type: "tuple";
    }];
    readonly name: "unsafeSetExitedValidatorsCount";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "_stakingModuleIds";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "_exitedValidatorsCounts";
        readonly type: "uint256[]";
    }];
    readonly name: "updateExitedValidatorsCountByStakingModule";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_nodeOperatorId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_refundedValidatorsCount";
        readonly type: "uint256";
    }];
    readonly name: "updateRefundedValidatorsCount";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_stakeShareLimit";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_priorityExitShareThreshold";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_stakingModuleFee";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_treasuryFee";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_maxDepositsPerBlock";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_minDepositBlockDistance";
        readonly type: "uint256";
    }];
    readonly name: "updateStakingModule";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_stakingModuleId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_nodeOperatorId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_targetLimitMode";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_targetLimit";
        readonly type: "uint256";
    }];
    readonly name: "updateTargetValidatorsLimits";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=StakingRouter.d.ts.map