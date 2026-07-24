import { type HandlerThis, type StateCtx } from './types';

export const withKeys = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withKeys requires withOperator to run first');
  await this.fork.addKeys(ctx.noId, 10);
  return {};
};
