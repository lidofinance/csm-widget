import {
  type HandlerThis,
  type StateCtx,
} from 'tests/shared/config/walletSetup/types';

export const withoutKeys = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withoutKeys requires withOperator to run first');
  await this.fork.removeKeys(ctx.noId);
  return {};
};
