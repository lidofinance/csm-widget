import { type HandlerThis, type StateCtx } from './types';

export const withGroup = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withGroup requires withOperator to run first');
  await this.fork.createOperatorGroup([
    { id: ctx.noId, weight: 50 },
    { id: 1, weight: 50 },
  ]);
  return {};
};
