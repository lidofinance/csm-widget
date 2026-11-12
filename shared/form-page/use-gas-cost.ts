import { type GasEstimate } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { useDappStatus, useMaxGasPrice } from 'modules/web3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  useFormControllerContext,
  useFormDataContext,
} from 'shared/hook-form/form-controller';
import { useEthUsd } from 'shared/hooks';
import { hashKey } from 'utils';
import { calcGasCostWei, formatUsdCost, hashString } from './gas-cost';

const DEBOUNCE_MS = 500;

type Settled = { key: string; estimate?: () => Promise<GasEstimate> };

export const useGasCost = () => {
  const { address, chainId } = useDappStatus();
  const { resolve, formName } = useFormControllerContext();
  const { data, isPending } = useFormDataContext();
  const { control, formState } = useFormContext();
  const values = useWatch({ control });
  const { isValid } = formState;
  const { maxGasPrice } = useMaxGasPrice();

  const flow = useMemo(
    () => (isPending ? undefined : resolve?.(values, data)),
    [resolve, values, data, isPending],
  ) as { action: string; estimate?: () => Promise<GasEstimate> } | undefined;

  const key = useMemo(
    () => hashString(hashKey([flow?.action, values, data])),
    [flow?.action, values, data],
  );

  const estimateRef = useRef(flow?.estimate);
  estimateRef.current = flow?.estimate;

  const [settled, setSettled] = useState<Settled>();
  useEffect(() => {
    const timer = setTimeout(
      () => setSettled({ key, estimate: estimateRef.current }),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [key]);

  const query = useQuery({
    queryKey: ['gas-estimate', formName, chainId, address, settled?.key],
    queryFn: () => settled?.estimate?.() ?? Promise.reject(),
    enabled: !!address && isValid && !!settled?.estimate,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });

  const costWei =
    query.data && maxGasPrice !== undefined && isValid && settled?.estimate
      ? calcGasCostWei(query.data.total, maxGasPrice)
      : undefined;
  const { usdAmount } = useEthUsd(costWei);

  return {
    value: usdAmount === undefined ? undefined : formatUsdCost(usdAmount),
    isLoading: query.isFetching,
  };
};
