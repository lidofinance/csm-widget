export declare const CSFeeOracleAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "feeDistributor";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "strikes";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "secondsPerSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "genesisTime";
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
    readonly name: "GENESIS_TIME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MANAGE_CONSENSUS_CONTRACT_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MANAGE_CONSENSUS_VERSION_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
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
    readonly name: "SECONDS_PER_SLOT";
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
        readonly internalType: "contract ICSStrikes";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "SUBMIT_DATA_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "discardConsensusReport";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizeUpgradeV2";
    readonly inputs: readonly [{
        readonly name: "consensusVersion";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getConsensusContract";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getConsensusReport";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "processingDeadlineTime";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "processingStarted";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getConsensusVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getContractVersion";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getLastProcessingRefSlot";
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
    }, {
        readonly name: "consensusContract";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "consensusVersion";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "setConsensusContract";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setConsensusVersion";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "submitConsensusReport";
    readonly inputs: readonly [{
        readonly name: "reportHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "deadline";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "submitReportData";
    readonly inputs: readonly [{
        readonly name: "data";
        readonly type: "tuple";
        readonly internalType: "struct ICSFeeOracle.ReportData";
        readonly components: readonly [{
            readonly name: "consensusVersion";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "refSlot";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "treeRoot";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "treeCid";
            readonly type: "string";
            readonly internalType: "string";
        }, {
            readonly name: "logCid";
            readonly type: "string";
            readonly internalType: "string";
        }, {
            readonly name: "distributed";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "rebate";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "strikesTreeRoot";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "strikesTreeCid";
            readonly type: "string";
            readonly internalType: "string";
        }];
    }, {
        readonly name: "contractVersion";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "ConsensusHashContractSet";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "prevAddr";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ConsensusVersionSet";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "prevVersion";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ContractVersionSet";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint256";
        readonly indexed: false;
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
    readonly name: "ProcessingStarted";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "hash";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReportDiscarded";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "hash";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReportSubmitted";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "hash";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }, {
        readonly name: "processingDeadlineTime";
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
    readonly type: "event";
    readonly name: "WarnProcessingMissed";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
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
    readonly name: "AddressCannotBeSame";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AddressCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FailedToSendEther";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "HashCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InitialRefSlotCannotBeLessThanProcessingOne";
    readonly inputs: readonly [{
        readonly name: "initialRefSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "processingRefSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "InvalidContractVersion";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidContractVersionIncrement";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoConsensusReportToProcess";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NonZeroContractVersionOnInit";
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
    readonly name: "PauseUntilMustBeInFuture";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PausedExpected";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ProcessingDeadlineMissed";
    readonly inputs: readonly [{
        readonly name: "deadline";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "RefSlotAlreadyProcessing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "RefSlotCannotDecrease";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "prevRefSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "RefSlotMustBeGreaterThanProcessingOne";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "processingRefSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
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
    readonly name: "SecondsPerSlotCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderIsNotTheConsensusContract";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SenderNotAllowed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UnexpectedChainConfig";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UnexpectedConsensusVersion";
    readonly inputs: readonly [{
        readonly name: "expectedVersion";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "receivedVersion";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "UnexpectedContractVersion";
    readonly inputs: readonly [{
        readonly name: "expected";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "received";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "UnexpectedDataHash";
    readonly inputs: readonly [{
        readonly name: "consensusHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "receivedHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
}, {
    readonly type: "error";
    readonly name: "UnexpectedRefSlot";
    readonly inputs: readonly [{
        readonly name: "consensusRefSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "dataRefSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "VersionCannotBeSame";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "VersionCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroAdminAddress";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ZeroFeeDistributorAddress";
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
//# sourceMappingURL=CSFeeOracle.d.ts.map