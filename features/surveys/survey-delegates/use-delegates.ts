import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { STRATEGY_LAZY } from 'consts';
import { useNodeOperatorId } from 'modules/web3';
import { useSurveysFetcher } from '../shared/use-surveys-fetcher';
import { DelegatesResponse, MAX_DELEGATES } from '../types';
import { useSiweAuth } from 'shared/siwe';
import { standardFetcher } from 'utils';
import { getExternalLinks } from 'consts/external-links';

const { surveyApi } = getExternalLinks();

export const useDelegates = () => {
  const nodeOperatorId = useNodeOperatorId();
  const url = `csm-${String(nodeOperatorId)}/delegates`;
  const queryClient = useQueryClient();
  const { token } = useSiweAuth();

  const [fetcher, , deleter] = useSurveysFetcher<DelegatesResponse>();

  const query = useQuery<DelegatesResponse>({
    queryKey: ['surveys', url],
    queryFn: () => fetcher(url),
    enabled: nodeOperatorId !== undefined,
    ...STRATEGY_LAZY,
  });

  const addMutation = useMutation({
    mutationFn: async (address: string) => {
      invariant(token, 'Token is not available');
      await standardFetcher(`${surveyApi}/${url}`, {
        method: 'POST',
        body: JSON.stringify({ address: address.toLowerCase() }),
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['surveys', url] });
      void queryClient.invalidateQueries({
        queryKey: ['surveys', `csm-${String(nodeOperatorId)}/summary`],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (address: string) => deleter(`${url}/${address.toLowerCase()}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['surveys', url] });
      void queryClient.invalidateQueries({
        queryKey: ['surveys', `csm-${String(nodeOperatorId)}/summary`],
      });
    },
  });

  const add = useCallback(
    (address: string) => addMutation.mutateAsync(address),
    [addMutation],
  );

  const remove = useCallback(
    (address: string) => removeMutation.mutateAsync(address),
    [removeMutation],
  );

  return {
    delegates: query.data?.delegates ?? [],
    isLoading: query.isLoading,
    error: query.error,
    add,
    remove,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    canAddMore: (query.data?.delegates?.length ?? 0) < MAX_DELEGATES,
  };
};
