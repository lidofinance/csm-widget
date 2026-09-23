/**
 * Test-only env variables. Merged into `NodeJS.ProcessEnv`, so `process.env.*`
 * and every `NodeJS.ProcessEnv` value (e.g. `ForkActionsOptions.env`) are typed.
 *
 * Values stay optional — env is always `string | undefined` at runtime.
 * `interface` is required here: declaration merging doesn't work with `type`.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    STAND_TYPE?: 'testnet' | 'prod' | 'staging' | 'preview' | 'local';

    WALLET_SECRET_PHRASE?: string;
    EMPTY_SECRET_PHRASE?: string;
    EMPTY_NODE_SECRET_PHRASE?: string;
    WALLET_PASSWORD?: string;

    RPC_URL?: string;

    PREVIEW_STAND_URL?: string;
    PREVIEW_STAND_LOGIN?: string;
    PREVIEW_STAND_PASSWORD?: string;

    REFUSE_CF_BLOCK_NAME?: string;
    REFUSE_CF_BLOCK_VALUE?: string;

    /** kubo RPC API of the IPFS node used to pin merkle trees */
    IPFS_API_URL?: string;

    /** Forked tests: 'true' enables fork mode */
    USE_FORK?: 'true' | 'false';
    /** Devnet deploy artifacts consumed by the CM SDK client */
    DEVNET_ADDRESSES_FILE_PATH?: string;

    TEST_TAGS?: string;
  }
}
