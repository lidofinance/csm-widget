import type { ForkActionsService } from '../forkActions.service.ts';

export const snapshot = async function (
  this: ForkActionsService,
): Promise<string> {
  return this.step('[Contract] Take EVM snapshot', async () => {
    const id = await this.client.request({
      method: 'evm_snapshot' as never,
      params: [] as never,
    });
    return id as string;
  });
};
