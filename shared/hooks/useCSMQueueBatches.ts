import { Zero } from '@ethersproject/constants';
import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { BigNumber, BigNumberish } from 'ethers';
import { chunk, range } from 'lodash';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { NodeOperatorId } from 'types';
import { getSettledValue } from 'utils';
import { useCSModuleRPC } from './useCsmContracts';

const unwrap = (batch: BigNumber, id: BigNumberish) => ({
  id: BigNumber.from(id),
  next: batch.and(
    '0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff',
  ),
  keysCount: batch
    .and('0x0000000000000000ffffffffffffffff00000000000000000000000000000000')
    .shr(128),
  nodeOperatorId: batch
    .and('0xffffffffffffffff000000000000000000000000000000000000000000000000')
    .shr(192)
    .toString() as NodeOperatorId,
});

type BatchItem = [BigNumber, BigNumber];
export const useCSMQueueBatches = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_IMMUTABLE,
) => {
  const contract = useCSModuleRPC();

  const fetcher = useCallback(async () => {
    invariant(nodeOperatorId);
    const { head, tail } = await contract.depositQueue();
    const chunks = chunk(range(head.toNumber(), tail.toNumber()), 10);

    const batches: ReturnType<typeof unwrap>[] = [];

    for await (const ids of chunks) {
      const res = await Promise.allSettled(
        ids.map((id) =>
          contract.depositQueueItem(id).then((r) => unwrap(r, id)),
        ),
      );
      batches.push(...res.flatMap(getSettledValue).filter((b) => !!b));
    }

    return batches.reduce(
      (acc, c) => {
        return !(acc.next.isZero() || acc.next.gte(c.id))
          ? acc
          : {
              summ: acc.summ.add(c.keysCount),
              next: c.next,
              your: acc.your.add(
                c.nodeOperatorId === nodeOperatorId ? c.keysCount : 0,
              ),
              list:
                c.nodeOperatorId === nodeOperatorId
                  ? [...acc.list, [acc.summ, c.keysCount] as BatchItem]
                  : acc.list,
            };
      },
      { summ: Zero, your: Zero, next: Zero, list: [] as BatchItem[] },
    );
  }, [contract, nodeOperatorId]);

  return useLidoSWR(
    ['deposit-queue-batches', nodeOperatorId],
    nodeOperatorId ? fetcher : null,
    config,
  );
};
