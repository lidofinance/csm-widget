import { useLidoSWR } from '@lido-sdk/react';
import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { standardFetcher } from 'utils';
import { useAccount } from './use-account';
import { useMergeSwr } from './useMergeSwr';

type ModulesResponse = {
  data: {
    nonce: number;
    type: string;
    id: number;
    stakingModuleAddress: string;
    moduleFee: number;
    treasuryFee: number;
    targetShare: number;
    status: number;
    name: string;
    lastDepositAt: number;
    lastDepositBlock: number;
    exitedValidatorsCount: number;
    active: boolean;
    lastChangedBlockHash: string;
  }[];
};

type ModuleOperatorsResponse = {
  data: {
    operators: [
      {
        index: number;
        active: boolean;
        name: string;
        rewardAddress: string;
        stakingLimit: number;
        stoppedValidators: number;
        totalSigningKeys: number;
        usedSigningKeys: number;
        moduleAddress: string;
      },
    ];
  };
};

const REPLACEMENTS: Record<string, string> = {
  'curated-onchain-v1': 'Lido Curated',
};

// TODO: move to api
const useSROperators = () => {
  const { keysApi } = getExternalLinks();
  const { stakingModuleId: csmId } = getCsmConstants();

  const fetcher = async () => {
    const { data: modules } = await standardFetcher<ModulesResponse>(
      `${keysApi}/v1/modules`,
    );
    const promises = modules.map(({ id }) => {
      if (id === csmId) return undefined;
      return standardFetcher<ModuleOperatorsResponse>(
        `${keysApi}/v1/modules/${id}/operators`,
      );
    });

    const promiseResults = await Promise.allSettled(promises);

    const operators = promiseResults.flatMap(
      (r) => (r.status === 'fulfilled' && r.value?.data.operators) || [],
    );

    return { operators, modules };
  };

  return useLidoSWR(['sr-operators', keysApi], fetcher, STRATEGY_IMMUTABLE);
};

export const useOperatorInOtherModule = () => {
  const { address } = useAccount();
  const operatorsSwr = useSROperators();

  const name = useMemo(() => {
    if (!operatorsSwr.data) return undefined;
    const { operators, modules } = operatorsSwr.data;
    const matchedOperator = operators.find((o) => o.rewardAddress === address);
    const matchedModule =
      matchedOperator &&
      modules.find(
        (m) => m.stakingModuleAddress === matchedOperator.moduleAddress,
      );
    return matchedModule?.name
      ? (REPLACEMENTS[matchedModule?.name] ?? matchedModule?.name)
      : null;
  }, [address, operatorsSwr.data]);

  return useMergeSwr([operatorsSwr], name);
};
