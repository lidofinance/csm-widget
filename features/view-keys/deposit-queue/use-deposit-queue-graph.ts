import { Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { useCSMShareLimitInfo } from 'shared/hooks';

const POTENTIAL_ADDED = BigNumber.from(100);
const BACK = BigNumber.from(30);
const MIN_SIZE = 2;

export const useDepositQueueGraph = () => {
  const { data, initialLoading } = useCSMShareLimitInfo();

  const form = useFormContext<DepositDataInputType>();
  const submitting: number | undefined = form?.getValues('depositData')?.length;

  return useMemo(() => {
    if (!data || initialLoading) return { isLoading: true };

    const { active, queue, capacity } = data;
    const added = submitting ? BigNumber.from(submitting) : Zero;
    const isSubmitting = submitting !== undefined;
    const potential = added.lt(POTENTIAL_ADDED) ? POTENTIAL_ADDED : added;

    const m0 = active.isZero() ? queue : active;
    const m1 = m0.sub(BACK).isNegative() ? m0 : m0.sub(BACK);
    const m2 = active.add(queue).add(potential);
    const md = m2.sub(m1);

    const extraLow = capacity.lt(m1.sub(md));
    const extraHigh = capacity.gt(m2.add(md));

    const l1 = m1.lt(capacity) ? m1 : extraLow ? m1 : capacity;
    const l2 = m2.gt(capacity) ? m2 : extraHigh ? m2 : capacity;
    const ld = l2.sub(l1);

    const g1 = extraLow ? 15 : l1.gt(potential) ? 15 : 0;
    const g2 = extraHigh ? 85 : 95;
    const gd = g2 - g1;
    const farAway = g1 > 0;

    const cc = (v: BigNumber) => v.sub(l1).mul(gd).div(ld).add(g1).toNumber();
    const ccc = (value: BigNumber, prev = Zero) => {
      const p = prev.isZero() ? 0 : Math.max(MIN_SIZE, cc(prev));
      return value.isZero() ? 0 : Math.max(MIN_SIZE, cc(value.add(prev)) - p);
    };

    const activeSize = ccc(active);
    const queueSize = ccc(queue, active);
    const addedSize = ccc(added, queue.add(active));
    const limitOffset = extraLow ? 8 : extraHigh ? 95 : cc(capacity);

    return {
      isLoading: false,
      graph: {
        active: {
          size: activeSize,
        },
        queue: {
          size: queueSize,
        },
        added: {
          size: addedSize,
        },
        limit: {
          offset: limitOffset,
        },
        farAway,
        isSubmitting,
      },
      values: {
        active: active.toString(),
        queue: queue.toString(),
        added: added.toString(),
        limit: capacity.toString(),
      },
    };
  }, [data, initialLoading, submitting]);
};
