export declare const CSAccountingAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "lidoLocator";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "module";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_feeDistributor";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "minBondLockPeriod";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "maxBondLockPeriod";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
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
    readonly name: "DEFAULT_BOND_CURVE_ID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "FEE_DISTRIBUTOR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSFeeDistributor";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "LIDO";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ILido";
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
    readonly name: "MANAGE_BOND_CURVES_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_BOND_LOCK_PERIOD";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MAX_CURVE_LENGTH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MIN_BOND_LOCK_PERIOD";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MIN_CURVE_LENGTH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MODULE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSModule";
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
    readonly name: "SET_BOND_CURVE_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITHDRAWAL_QUEUE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IWithdrawalQueue";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WSTETH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IWstETH";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addBondCurve";
    readonly inputs: readonly [{
        readonly name: "bondCurve";
        readonly type: "tuple[]";
        readonly internalType: "struct ICSBondCurve.BondCurveIntervalInput[]";
        readonly components: readonly [{
            readonly name: "minKeysCount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "trend";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "id";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "chargeFee";
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
    readonly name: "chargePenaltyRecipient";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "claimRewardsStETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "stETHAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "cumulativeFeeShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "rewardsProof";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly outputs: readonly [{
        readonly name: "claimedShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "claimRewardsUnstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "stETHAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "cumulativeFeeShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "rewardsProof";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly outputs: readonly [{
        readonly name: "requestId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "claimRewardsWstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "wstETHAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "cumulativeFeeShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "rewardsProof";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly outputs: readonly [{
        readonly name: "claimedWstETH";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "compensateLockedBondETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "depositETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "depositStETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "stETHAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "depositWstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "wstETHAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "feeDistributor";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ICSFeeDistributor";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "finalizeUpgradeV2";
    readonly inputs: readonly [{
        readonly name: "bondCurvesInputs";
        readonly type: "tuple[][]";
        readonly internalType: "struct ICSBondCurve.BondCurveIntervalInput[][]";
        readonly components: readonly [{
            readonly name: "minKeysCount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "trend";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getActualLockedBond";
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
    readonly name: "getBond";
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
    readonly name: "getBondAmountByKeysCount";
    readonly inputs: readonly [{
        readonly name: "keys";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "curveId";
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
    readonly name: "getBondAmountByKeysCountWstETH";
    readonly inputs: readonly [{
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "curveId";
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
    readonly name: "getBondCurve";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct ICSBondCurve.BondCurve";
        readonly components: readonly [{
            readonly name: "intervals";
            readonly type: "tuple[]";
            readonly internalType: "struct ICSBondCurve.BondCurveInterval[]";
            readonly components: readonly [{
                readonly name: "minKeysCount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "minBond";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "trend";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getBondCurveId";
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
    readonly name: "getBondLockPeriod";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getBondShares";
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
    readonly name: "getBondSummary";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "current";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "required";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getBondSummaryShares";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "current";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "required";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getClaimableBondShares";
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
    readonly name: "getClaimableRewardsAndBondShares";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "cumulativeFeeShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "rewardsProof";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }];
    readonly outputs: readonly [{
        readonly name: "claimableShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getCurveInfo";
    readonly inputs: readonly [{
        readonly name: "curveId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct ICSBondCurve.BondCurve";
        readonly components: readonly [{
            readonly name: "intervals";
            readonly type: "tuple[]";
            readonly internalType: "struct ICSBondCurve.BondCurveInterval[]";
            readonly components: readonly [{
                readonly name: "minKeysCount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "minBond";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }, {
                readonly name: "trend";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getCurvesCount";
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
    readonly name: "getKeysCountByBondAmount";
    readonly inputs: readonly [{
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "curveId";
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
    readonly name: "getLockedBondInfo";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct ICSBondLock.BondLock";
        readonly components: readonly [{
            readonly name: "amount";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }, {
            readonly name: "until";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getRequiredBondForNextKeys";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "additionalKeys";
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
    readonly name: "getRequiredBondForNextKeysWstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "additionalKeys";
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
    readonly name: "getUnbondedKeysCount";
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
    readonly name: "getUnbondedKeysCountToEject";
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
        readonly name: "bondCurve";
        readonly type: "tuple[]";
        readonly internalType: "struct ICSBondCurve.BondCurveIntervalInput[]";
        readonly components: readonly [{
            readonly name: "minKeysCount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "trend";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "admin";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "bondLockPeriod";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_chargePenaltyRecipient";
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
    readonly name: "lockBondETH";
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
    readonly name: "penalize";
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
    readonly name: "pullFeeRewards";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "cumulativeFeeShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "rewardsProof";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
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
    readonly name: "recoverStETHShares";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "releaseLockedBondETH";
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
    readonly name: "renewBurnerAllowance";
    readonly inputs: readonly [];
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
    readonly name: "setBondCurve";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "curveId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setBondLockPeriod";
    readonly inputs: readonly [{
        readonly name: "period";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setChargePenaltyRecipient";
    readonly inputs: readonly [{
        readonly name: "_chargePenaltyRecipient";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settleLockedBondETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "applied";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
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
    readonly name: "totalBondShares";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "updateBondCurve";
    readonly inputs: readonly [{
        readonly name: "curveId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "bondCurve";
        readonly type: "tuple[]";
        readonly internalType: "struct ICSBondCurve.BondCurveIntervalInput[]";
        readonly components: readonly [{
            readonly name: "minKeysCount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "trend";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "BondBurned";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "amountToBurn";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "burnedAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondCharged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "toChargeAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "chargedAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondClaimedStETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
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
    readonly name: "BondClaimedUnstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "requestId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondClaimedWstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
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
    readonly name: "BondCurveAdded";
    readonly inputs: readonly [{
        readonly name: "curveId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "bondCurveIntervals";
        readonly type: "tuple[]";
        readonly indexed: false;
        readonly internalType: "struct ICSBondCurve.BondCurveIntervalInput[]";
        readonly components: readonly [{
            readonly name: "minKeysCount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "trend";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondCurveSet";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "curveId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondCurveUpdated";
    readonly inputs: readonly [{
        readonly name: "curveId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "bondCurveIntervals";
        readonly type: "tuple[]";
        readonly indexed: false;
        readonly internalType: "struct ICSBondCurve.BondCurveIntervalInput[]";
        readonly components: readonly [{
            readonly name: "minKeysCount";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "trend";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondDepositedETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
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
    readonly name: "BondDepositedStETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
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
    readonly name: "BondDepositedWstETH";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
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
    readonly name: "BondLockChanged";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "newAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "until";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondLockCompensated";
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
    readonly name: "BondLockPeriodChanged";
    readonly inputs: readonly [{
        readonly name: "period";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "BondLockRemoved";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ChargePenaltyRecipientSet";
    readonly inputs: readonly [{
        readonly name: "chargePenaltyRecipient";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
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
    readonly name: "ElRewardsVaultReceiveFailed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedToSendEther";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondCurveId";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondCurveLength";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondCurveMaxLength";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondCurveValues";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondCurvesLength";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondLockAmount";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBondLockPeriod";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitializationCurveId";
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
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NothingToClaim";
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
    readonly name: "ResumedExpected";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SafeCastOverflowedUintDowncast";
    readonly inputs: readonly [{
        readonly name: "bits";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "value";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotEligible";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotModule";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroAdminAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroChargePenaltyRecipientAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroFeeDistributorAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroLocatorAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroModuleAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroPauseDuration";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=CSAccounting.d.ts.map