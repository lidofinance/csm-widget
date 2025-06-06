export declare const CSVerifierAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "withdrawalAddress";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "module";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "slotsPerEpoch";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "gindices";
        readonly type: "tuple";
        readonly internalType: "struct ICSVerifier.GIndices";
        readonly components: readonly [{
            readonly name: "gIFirstWithdrawalPrev";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }, {
            readonly name: "gIFirstWithdrawalCurr";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }, {
            readonly name: "gIFirstValidatorPrev";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }, {
            readonly name: "gIFirstValidatorCurr";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }, {
            readonly name: "gIHistoricalSummariesPrev";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }, {
            readonly name: "gIHistoricalSummariesCurr";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }];
    }, {
        readonly name: "firstSupportedSlot";
        readonly type: "uint64";
        readonly internalType: "Slot";
    }, {
        readonly name: "pivotSlot";
        readonly type: "uint64";
        readonly internalType: "Slot";
    }, {
        readonly name: "admin";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "BEACON_ROOTS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
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
    readonly name: "FIRST_SUPPORTED_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "Slot";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "GI_FIRST_VALIDATOR_CURR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "GIndex";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "GI_FIRST_VALIDATOR_PREV";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "GIndex";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "GI_FIRST_WITHDRAWAL_CURR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "GIndex";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "GI_FIRST_WITHDRAWAL_PREV";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "GIndex";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "GI_HISTORICAL_SUMMARIES_CURR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "GIndex";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "GI_HISTORICAL_SUMMARIES_PREV";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "GIndex";
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
    readonly name: "PIVOT_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "Slot";
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
    readonly name: "SLOTS_PER_EPOCH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITHDRAWAL_ADDRESS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
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
    readonly name: "processHistoricalWithdrawalProof";
    readonly inputs: readonly [{
        readonly name: "beaconBlock";
        readonly type: "tuple";
        readonly internalType: "struct ICSVerifier.ProvableBeaconBlockHeader";
        readonly components: readonly [{
            readonly name: "header";
            readonly type: "tuple";
            readonly internalType: "struct BeaconBlockHeader";
            readonly components: readonly [{
                readonly name: "slot";
                readonly type: "uint64";
                readonly internalType: "Slot";
            }, {
                readonly name: "proposerIndex";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "parentRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "stateRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "bodyRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
        }, {
            readonly name: "rootsTimestamp";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }];
    }, {
        readonly name: "oldBlock";
        readonly type: "tuple";
        readonly internalType: "struct ICSVerifier.HistoricalHeaderWitness";
        readonly components: readonly [{
            readonly name: "header";
            readonly type: "tuple";
            readonly internalType: "struct BeaconBlockHeader";
            readonly components: readonly [{
                readonly name: "slot";
                readonly type: "uint64";
                readonly internalType: "Slot";
            }, {
                readonly name: "proposerIndex";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "parentRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "stateRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "bodyRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
        }, {
            readonly name: "rootGIndex";
            readonly type: "bytes32";
            readonly internalType: "GIndex";
        }, {
            readonly name: "proof";
            readonly type: "bytes32[]";
            readonly internalType: "bytes32[]";
        }];
    }, {
        readonly name: "witness";
        readonly type: "tuple";
        readonly internalType: "struct ICSVerifier.WithdrawalWitness";
        readonly components: readonly [{
            readonly name: "withdrawalOffset";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "withdrawalIndex";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "validatorIndex";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "amount";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "withdrawalCredentials";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "effectiveBalance";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "slashed";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "activationEligibilityEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "activationEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "exitEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "withdrawableEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "withdrawalProof";
            readonly type: "bytes32[]";
            readonly internalType: "bytes32[]";
        }, {
            readonly name: "validatorProof";
            readonly type: "bytes32[]";
            readonly internalType: "bytes32[]";
        }];
    }, {
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keyIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "processWithdrawalProof";
    readonly inputs: readonly [{
        readonly name: "beaconBlock";
        readonly type: "tuple";
        readonly internalType: "struct ICSVerifier.ProvableBeaconBlockHeader";
        readonly components: readonly [{
            readonly name: "header";
            readonly type: "tuple";
            readonly internalType: "struct BeaconBlockHeader";
            readonly components: readonly [{
                readonly name: "slot";
                readonly type: "uint64";
                readonly internalType: "Slot";
            }, {
                readonly name: "proposerIndex";
                readonly type: "uint64";
                readonly internalType: "uint64";
            }, {
                readonly name: "parentRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "stateRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }, {
                readonly name: "bodyRoot";
                readonly type: "bytes32";
                readonly internalType: "bytes32";
            }];
        }, {
            readonly name: "rootsTimestamp";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }];
    }, {
        readonly name: "witness";
        readonly type: "tuple";
        readonly internalType: "struct ICSVerifier.WithdrawalWitness";
        readonly components: readonly [{
            readonly name: "withdrawalOffset";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "withdrawalIndex";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "validatorIndex";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "amount";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "withdrawalCredentials";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "effectiveBalance";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "slashed";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "activationEligibilityEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "activationEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "exitEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "withdrawableEpoch";
            readonly type: "uint64";
            readonly internalType: "uint64";
        }, {
            readonly name: "withdrawalProof";
            readonly type: "bytes32[]";
            readonly internalType: "bytes32[]";
        }, {
            readonly name: "validatorProof";
            readonly type: "bytes32[]";
            readonly internalType: "bytes32[]";
        }];
    }, {
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keyIndex";
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
    readonly name: "IndexOutOfRange";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidBlockHeader";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidChainConfig";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidGIndex";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidPivotSlot";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidWithdrawalAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PartialWithdrawal";
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
    readonly name: "RootNotFound";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UnsupportedSlot";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "uint64";
        readonly internalType: "Slot";
    }];
}, {
    readonly type: "error";
    readonly name: "ValidatorNotWithdrawn";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroAdminAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroModuleAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroPauseDuration";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroWithdrawalAddress";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=CSVerifier.d.ts.map