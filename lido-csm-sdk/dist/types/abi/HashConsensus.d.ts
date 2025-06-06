export declare const HashConsensusAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "slotsPerEpoch";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "secondsPerSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "genesisTime";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "epochsPerFrame";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "fastLaneLengthSlots";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "admin";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "reportProcessor";
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
    readonly name: "DISABLE_CONSENSUS_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MANAGE_FAST_LANE_CONFIG_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MANAGE_FRAME_CONFIG_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MANAGE_MEMBERS_AND_QUORUM_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MANAGE_REPORT_PROCESSOR_ROLE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "addMember";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "quorum";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "disableConsensus";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getChainConfig";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "slotsPerEpoch";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "secondsPerSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "genesisTime";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getConsensusState";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "consensusReport";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "isReportProcessing";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getConsensusStateForMember";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "result";
        readonly type: "tuple";
        readonly internalType: "struct HashConsensus.MemberConsensusState";
        readonly components: readonly [{
            readonly name: "currentFrameRefSlot";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "currentFrameConsensusReport";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "isMember";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "isFastLane";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "canReport";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "lastMemberReportRefSlot";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "currentFrameMemberReport";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getCurrentFrame";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "reportProcessingDeadlineSlot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getFastLaneMembers";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addresses";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "lastReportedRefSlots";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getFrameConfig";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "initialEpoch";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "epochsPerFrame";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "fastLaneLengthSlots";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getInitialRefSlot";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getIsFastLaneMember";
    readonly inputs: readonly [{
        readonly name: "addr";
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
    readonly name: "getIsMember";
    readonly inputs: readonly [{
        readonly name: "addr";
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
    readonly name: "getMembers";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addresses";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "lastReportedRefSlots";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getQuorum";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getReportProcessor";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getReportVariants";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "variants";
        readonly type: "bytes32[]";
        readonly internalType: "bytes32[]";
    }, {
        readonly name: "support";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
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
    readonly name: "removeMember";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "quorum";
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
    readonly name: "setFastLaneLengthSlots";
    readonly inputs: readonly [{
        readonly name: "fastLaneLengthSlots";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setFrameConfig";
    readonly inputs: readonly [{
        readonly name: "epochsPerFrame";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "fastLaneLengthSlots";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setQuorum";
    readonly inputs: readonly [{
        readonly name: "quorum";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setReportProcessor";
    readonly inputs: readonly [{
        readonly name: "newProcessor";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "submitReport";
    readonly inputs: readonly [{
        readonly name: "slot";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "report";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "consensusVersion";
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
    readonly type: "function";
    readonly name: "updateInitialEpoch";
    readonly inputs: readonly [{
        readonly name: "initialEpoch";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "ConsensusLost";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ConsensusReached";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "report";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }, {
        readonly name: "support";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "FastLaneConfigSet";
    readonly inputs: readonly [{
        readonly name: "fastLaneLengthSlots";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "FrameConfigSet";
    readonly inputs: readonly [{
        readonly name: "newInitialEpoch";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "newEpochsPerFrame";
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
    readonly name: "MemberAdded";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newTotalMembers";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "newQuorum";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "MemberRemoved";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newTotalMembers";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "newQuorum";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "QuorumSet";
    readonly inputs: readonly [{
        readonly name: "newQuorum";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "totalMembers";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "prevQuorum";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReportProcessorSet";
    readonly inputs: readonly [{
        readonly name: "processor";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "prevProcessor";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReportReceived";
    readonly inputs: readonly [{
        readonly name: "refSlot";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "member";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "report";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }];
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
    readonly name: "AddressCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AdminCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ConsensusReportAlreadyProcessing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "DuplicateMember";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "DuplicateReport";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EmptyReport";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EpochsPerFrameCannotBeZero";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "FastLanePeriodCannotBeLongerThanFrame";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InitialEpochAlreadyArrived";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InitialEpochIsYetToArrive";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InitialEpochRefSlotCannotBeEarlierThanProcessingSlot";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidChainConfig";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialization";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSlot";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NewProcessorCannotBeTheSame";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NonFastLaneMemberCannotReportWithinFastLaneInterval";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NonMember";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotInitializing";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NumericOverflow";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "QuorumTooSmall";
    readonly inputs: readonly [{
        readonly name: "minQuorum";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "receivedQuorum";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}, {
    readonly type: "error";
    readonly name: "ReportProcessorCannotBeZero";
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
    readonly name: "StaleReport";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UnexpectedConsensusVersion";
    readonly inputs: readonly [{
        readonly name: "expected";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "received";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
}];
//# sourceMappingURL=HashConsensus.d.ts.map