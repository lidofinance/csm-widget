import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useSiweAuth } from 'modules/siwe';
import { dispatchAuthError } from '../api/errors';

// Thunk-based successor to `useSurveysMutation`. Instead of a path string + the
// old `surveysPost`/`surveysDelete` transport, the caller supplies
// `makeRequest` — a thunk that runs a generated SDK call through `callSurvey`
// (e.g. `(body) => callSurvey(() => icsApply({ ...surveyRequest(token), body }))`).
//
// Parity with the old hook so the two coexist during migration:
//   • Token + auth-error callback come from `useSiweAuth()`.
//   • `mutationKey`, `invalidate` (each key → invalidateQueries on success),
//     `onSuccess`, `onError` behave identically.
//   • onAuthError: the old transport fired `onAuthError(kind)` on auth failures,
//     but only when a token was actually sent. The configured survey client no
//     longer does this, so we reproduce it via `dispatchAuthError` (which keeps
//     that token guard) before rethrowing (callers' onError / catch still see
//     the original error).

type SurveyMutationRequestArgs = {
  token?: string;
};

type UseSurveyMutationOptions<T, B> = {
  mutationKey?: unknown[];
  invalidate?: readonly (readonly unknown[])[];
  onSuccess?: (result: T, vars: B) => void;
  onError?: (err: unknown, vars: B) => void;
};

export const useSurveyMutation = <T = unknown, B = unknown>(
  makeRequest: (
    vars: B,
    args: SurveyMutationRequestArgs,
  ) => Promise<T | undefined>,
  opts: UseSurveyMutationOptions<T, B> = {},
): UseMutationResult<T, Error, B> => {
  const { token, handleAuthError } = useSiweAuth();
  const queryClient = useQueryClient();

  return useMutation<T, Error, B>({
    mutationKey: opts.mutationKey,
    mutationFn: async (vars: B) => {
      try {
        return (await makeRequest(vars, { token })) as T;
      } catch (error) {
        dispatchAuthError(error, token, handleAuthError);
        throw error;
      }
    },
    onSuccess: (result, vars) => {
      if (opts.invalidate) {
        for (const key of opts.invalidate) {
          void queryClient.invalidateQueries({ queryKey: key });
        }
      }
      opts.onSuccess?.(result, vars);
    },
    onError: opts.onError,
  });
};
