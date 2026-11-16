import type { QueryClient } from '@tanstack/react-query';

export const getSmVersionKey = (modules: readonly (string | undefined)[]) => [
  'sm-version',
  { modules },
];

/** Every deployed module supported implies any single one is. */
export const getImpliedVersionSupport = (
  queryClient: QueryClient,
  allModules: readonly (string | undefined)[],
): true | undefined =>
  queryClient.getQueryData<boolean>(getSmVersionKey(allModules)) === true
    ? true
    : undefined;
