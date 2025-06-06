export declare const CSEjectorAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "module";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "strikes";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "stakingModuleId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "admin";
        readonly type: "address";
        readonly internalType: "address";
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
    readonly name: "STAKING_MODULE_ID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "STRIKES";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "STRIKES_EXIT_TYPE_ID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VOLUNTARY_EXIT_TYPE_ID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ejectBadPerformer";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keyIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "refundRecipient";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
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
    readonly type: "function";
    readonly name: "triggerableWithdrawalsGateway";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ITriggerableWithdrawalsGateway";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "voluntaryEject";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "startFrom";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keysCount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "refundRecipient";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "voluntaryEjectByArray";
    readonly inputs: readonly [{
        readonly name: "nodeOperatorId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "keyIndices";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "refundRecipient";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
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
    readonly name: "AlreadyWithdrawn";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NodeOperatorDoesNotExist";
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
    readonly name: "SenderIsNotEligible";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotStrikes";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SigningKeysInvalidOffset";
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
    readonly name: "ZeroStrikesAddress";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=CSEjector.d.ts.map