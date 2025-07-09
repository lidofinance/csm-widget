import {
  useDepositQueueBatches,
  useNodeOperatorId,
  useOperatorInfo,
  useShareLimit,
} from 'modules/web3';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { calculateAndSelectByOperator } from './calculate-and-select-by-operator';

const POTENTIAL_ADDED = 25n;
const BACK = 30n;

// type Pos = { size: number; offset: number };
// const mergeBatches = (list?: Pos[]) =>
//   list?.reduce((acc, c) => {
//     const last = acc.at(-1);
//     if (!last || last.offset + last.size < c.offset) return [...acc, c];
//     last.size = c.offset + c.size - last.offset;
//     return acc;
//   }, [] as Pos[]);

export const useDepositQueueGraph = (fullView = false) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const hasDepositable = info?.depositableValidatorsCount;

  const { data: shareLimit } = useShareLimit();
  const { data: queueAnalysis } = useDepositQueueBatches(
    calculateAndSelectByOperator(nodeOperatorId), // TODO: should it be callback?
  );

  // console.log('>>', { shareLimit, queueAnalysis, info });

  const form = useFormContext<DepositDataInputType>();
  // TODO: transform to array [0..minPriorityQueue] -> added keys count
  const submitting: number | undefined = form?.getValues('depositData')?.length;

  const minSize = fullView ? 0.5 : 1; // percentage

  return useMemo(() => {
    if (!shareLimit || !queueAnalysis) return { isLoading: true };

    const { active, queue, capacity, activeLeft } = shareLimit;
    const added = BigInt(submitting || 0);
    const isSubmitting = submitting !== undefined;
    const potential = added < POTENTIAL_ADDED ? POTENTIAL_ADDED : added;

    const m0 = active < BACK ? 0n : active;
    const m1 = m0 - BACK < 0 ? m0 : m0 - BACK;
    const m2 = active + queue + potential;
    const md = m2 - m1;

    const extraLow = !fullView && capacity < m1 - md;
    const extraHigh = !fullView && capacity > m2 + md;

    const l1 = fullView ? 0n : m1 < capacity ? m1 : extraLow ? m1 : capacity;
    const l2 = m2 > capacity ? m2 : extraHigh ? m2 : capacity;
    const ld = l2 - l1;

    const g1 = fullView ? 0 : extraLow ? 15 : l1 > potential ? 15 : 0;
    const g2 = fullView ? 95 : extraHigh ? 85 : 95;
    const gd = g2 - g1;
    const farAway = g1 > 0;

    const cc = (v: bigint) => Number(((v - l1) * BigInt(gd)) / BigInt(ld)) + g1;
    const ccc = (value: bigint, prev = 0n) => {
      const p = prev === 0n ? 0 : Math.max(minSize, cc(prev));
      return value === 0n ? 0 : Math.max(minSize, cc(value + prev) - p);
    };

    const queueUnderLimit =
      activeLeft > 0n ? (queue < activeLeft ? queue : activeLeft) : 0n;
    const queueOverLimit = queue - queueUnderLimit;

    const activeSize = ccc(active);
    const queueSize = ccc(queueUnderLimit, active);
    const queueOverLimitSize = ccc(queueOverLimit, queueUnderLimit + active);
    const addedSize = ccc(added, queue + active);
    const limitOffset = extraLow ? 8 : extraHigh ? 95 : cc(capacity);

    // const koef =
    //   batches?.summ.isZero() || queue.isZero()
    //     ? One.mul(100)
    //     : queue
    //         .mul(100)
    //         .div(batches?.summ || queue)
    //         .toNumber();

    // const yourBatches = mergeBatches(
    //   batches?.list.map((batch) => {
    //     const offset = batch[0].mul(koef).div(100);
    //     let size = batch[1].mul(koef).div(100);
    //     if (size.isZero() && !batch[1].isZero()) size = One;

    //     const batchProps = {
    //       size: ccc(size, active.add(offset)),
    //       offset: cc(offset.add(active)),
    //     };

    //     if (
    //       batchProps.offset + batchProps.size >
    //       activeSize + queueSize + queueOverLimitSize
    //     ) {
    //       batchProps.offset =
    //         activeSize + queueSize + queueOverLimitSize - batchProps.size;
    //     }

    //     return batchProps;
    //   }),
    // );

    const depositable: string = hasDepositable
      ? // isBatchesLoading
        //   ? '...'
        //   :
        hasDepositable.toString()
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
        // your: yourBatches,
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
    shareLimit,
    queueAnalysis,
    submitting,
    fullView,
    hasDepositable,
    minSize,
  ]);
};
