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
    ANVIL_PORT?: string;

    PREVIEW_STAND_URL?: string;
    PREVIEW_STAND_LOGIN?: string;
    PREVIEW_STAND_PASSWORD?: string;

    REFUSE_CF_BLOCK_NAME?: string;
    REFUSE_CF_BLOCK_VALUE?: string;

    /** Just recipes: target chain (must match a `script/Deploy*<Chain>.s.sol`) */
    CHAIN?: 'hoodi' | 'mainnet';
    /** Just recipes: path to the deploy artifacts JSON */
    DEPLOY_CONFIG?: string;
    /** Just recipes: artifacts directory */
    ARTIFACTS_DIR?: string;

    /** Forked tests: 'true' enables fork mode */
    USE_FORK?: 'true' | 'false';
    /** Path to the fork-actions repo (the one with a Justfile) */
    JUST_DIR?: string;
    /** Env file inside JUST_DIR, e.g. `.env.hoodi-cm`. Empty — the repo's own `.env` */
    JUST_DOTENV?: string;
    DEVNET_ADDRESSES_FILE_PATH?: string;

    TEST_TAGS?: string;
  }
}
