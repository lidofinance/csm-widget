import { type HandlerThis, type StateCtx } from './types';

export const withOperator = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  const noId = await this.fork.createCuratedOperator(ctx.gates[0], ctx.address);
  if (noId === undefined)
    throw new Error(`Operator was not created via gate "${ctx.gates[0]}"`);
  return { noIds: [...ctx.noIds, noId] };
};
