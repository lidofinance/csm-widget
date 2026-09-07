import { type HandlerThis, type StateCtx } from './types';

export const withKeys = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  const [noId] = ctx.noIds;
  if (noId === undefined)
    throw new Error('withKeys requires withOperator to run first');
  await this.fork.addKeys(noId, 10);
  return {};
};
