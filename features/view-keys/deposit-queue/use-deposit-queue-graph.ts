import { One, Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { useCSMShareLimitInfo, useNodeOperatorInfo } from 'shared/hooks';
import { useCSMQueueBatches } from 'shared/hooks/useCSMQueueBatches';

const POTENTIAL_ADDED = BigNumber.from(100);
const BACK = BigNumber.from(30);
const MIN_SIZE = 1; // percentage

type Pos = { size: number; offset: number };
const mergeBatches = (list?: Pos[]) =>
  list?.reduce((acc, c) => {
    const last = acc.at(-1);
    if (!last || last.offset + last.size < c.offset) return [...acc, c];
    last.size = c.offset + c.size - last.offset;
    return acc;
  }, [] as Pos[]);

export const useDepositQueueGraph = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(nodeOperatorId);
  const hasDepositable = info?.depositableValidatorsCount;

  const { data, initialLoading } = useCSMShareLimitInfo();
  const { data: batches, initialLoading: isBatchesLoading } =
    useCSMQueueBatches(hasDepositable ? nodeOperatorId : undefined);

  const form = useFormContext<DepositDataInputType>();
  const submitting: number | undefined = form?.getValues('depositData')?.length;

  return useMemo(() => {
    if (!data || initialLoading) return { isLoading: true };

    const { active, queue, capacity, activeLeft } = data;
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

    const queueUnderLimit = queue.lt(activeLeft) ? queue : activeLeft;
    const queueOverLimit = queue.sub(queueUnderLimit);

    const activeSize = ccc(active);
    const queueSize = ccc(queueUnderLimit, active);
    const queueOverLimitSize = ccc(queueOverLimit, queueUnderLimit.add(active));
    const addedSize = ccc(added, queue.add(active));
    const limitOffset = extraLow ? 8 : extraHigh ? 95 : cc(capacity);

    const koef = queue
      .mul(100)
      .div(batches?.summ || queue)
      .toNumber();

    const yourBatches = mergeBatches(
      batches?.list.map((batch) => {
        const offset = batch[0].mul(koef).div(100);
        let size = batch[1].mul(koef).div(100);
        if (size.isZero() && !batch[1].isZero()) size = One;

        return {
          size: ccc(size, active.add(offset)),
          offset: cc(offset.add(active)),
        };
      }),
    );

    const depositable: string = hasDepositable
      ? isBatchesLoading
        ? '...'
        : hasDepositable.toString()
      : '0';

    return {
      isLoading: false,
      graph: {
        active: {
          size: activeSize,
        },
        queue: {
          size: queueSize,
        },
        queueOverLimit: {
          size: queueOverLimitSize,
        },
        added: {
          size: addedSize,
        },
        limit: {
          offset: limitOffset,
        },
        your: yourBatches,
        farAway,
        isSubmitting,
      },
      values: {
        active: active.toString(),
        queue: queueUnderLimit.toString(),
        queueOverLimit: queueOverLimit.toString(),
        added: added.toString(),
        limit: capacity.toString(),
        your: depositable,
      },
    };
  }, [
    batches?.list,
    batches?.summ,
    data,
    hasDepositable,
    initialLoading,
    isBatchesLoading,
    submitting,
  ]);
};
