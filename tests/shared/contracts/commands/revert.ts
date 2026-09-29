import type { ForkActionsService } from '../forkActions.service.ts';

export const revert = async function (
  this: ForkActionsService,
  id?: string,
): Promise<void> {
  await this.step(
    `[Contract] Revert EVM to snapshot ${id ?? 'latest'}`,
    async () => {
      const target = id ?? (await previousSnapshot(this));
      const reverted = await this.client.request({
        method: 'evm_revert' as never,
        params: [target] as never,
      });
      if (!reverted) {
        throw new Error(`Failed to revert to snapshot ${target}`);
      }
    },
  );
};

const previousSnapshot = async (service: ForkActionsService) => {
  const probe = await service.client.request({
    method: 'evm_snapshot' as never,
    params: [] as never,
  });
  return `0x${(BigInt(probe as string) - 1n).toString(16)}`;
};
