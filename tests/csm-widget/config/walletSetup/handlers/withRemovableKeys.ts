import {
  type HandlerThis,
  type StateCtx,
} from 'tests/shared/config/walletSetup/types';

const REMOVABLE_KEYS = 10;

export const withRemovableKeys = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withRemovableKeys requires withOperator to run first');
  await this.fork.addKeys(ctx.noId, REMOVABLE_KEYS);
  return {};
};
