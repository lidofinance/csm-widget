import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useSiweAuth } from 'modules/siwe';
import invariant from 'tiny-invariant';
import { surveysDelete, surveysPost } from '../api/surveys-api';

type UseSurveysMutationOptions<T, B> = {
  method?: 'POST' | 'DELETE'; // default 'POST'
  mutationKey?: unknown[]; // keys to invalidate on success
  invalidate?: readonly (readonly unknown[])[];
  onSuccess?: (result: T, vars: B) => void;
  onError?: (err: unknown, vars: B) => void;
};

export const useSurveysMutation = <T = unknown, B = unknown>(
  path: string | ((vars: B) => string),
  opts: UseSurveysMutationOptions<T, B> = {},
): UseMutationResult<T, Error, B> => {
  const { token, logout } = useSiweAuth();
  const queryClient = useQueryClient();
  const method = opts.method ?? 'POST';

  return useMutation<T, Error, B>({
    mutationKey: opts.mutationKey,
    mutationFn: async (vars: B) => {
      const resolvedPath = typeof path === 'function' ? path(vars) : path;
      invariant(resolvedPath, 'useSurveysMutation: path is empty');
      const fetchOpts = { token, onAuthError: logout };
      if (method === 'DELETE') {
        return surveysDelete<T>(resolvedPath, fetchOpts);
      }
      return surveysPost<T, B>(resolvedPath, vars, fetchOpts);
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
