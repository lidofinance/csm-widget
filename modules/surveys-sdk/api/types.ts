import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';

type Module = Lowercase<(typeof MODULE_NAME)[keyof typeof MODULE_NAME]>;

// Branded namespaced key, e.g. 'csm-42'. Always built via `operatorKey()`.
export type OperatorKey = `${Module}-${bigint}`;
