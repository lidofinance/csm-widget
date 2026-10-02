export type OperatorKeyPrefix = 'csm' | 'csm02' | 'cm';

// Branded namespaced key, e.g. 'csm-42'. Always built via `operatorKey()`.
export type OperatorKey = `${OperatorKeyPrefix}-${bigint}`;
