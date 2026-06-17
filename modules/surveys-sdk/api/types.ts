import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';

type Module = Lowercase<(typeof MODULE_NAME)[keyof typeof MODULE_NAME]>;

// Branded namespaced key, e.g. 'csm-42'. Always built via `operatorKey()`.
export type OperatorKey = `${Module}-${bigint}`;

export type SurveysFetchOptions = {
  // Bearer-style header value, e.g. `${token_type} ${access_token}`.
  // Required for authenticated requests.
  token?: string;
  // Invoked on 401/403 before throwing.
  onAuthError?: () => void;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
};
