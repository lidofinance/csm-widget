export declare const PermissionlessGateAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "module";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "admin";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "CURVE_ID";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "addNodeOperatorETH";
    readonly inputs: readonly [{
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
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "addNodeOperatorStETH";
    readonly inputs: readonly [{
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
    readonly name: "addNodeOperatorWstETH";
    readonly inputs: readonly [{
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
    readonly name: "ZeroAdminAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroModuleAddress";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=PermissionlessGate.d.ts.map