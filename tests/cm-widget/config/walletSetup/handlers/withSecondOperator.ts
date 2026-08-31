import { type HandlerThis, type StateCtx } from './types';

export const withSecondOperator = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withSecondOperator requires withOperator to run first');

  const gate = ctx.gates[1];
  if (gate === undefined)
    throw new Error('withSecondOperator requires a second gate in the preset');

  const noId = await this.fork.createCuratedOperator(gate, ctx.address);
  if (noId === undefined)
    throw new Error(`Second operator was not created via gate "${gate}"`);

  return { noIds: [...(ctx.noIds ?? []), noId] };
};
