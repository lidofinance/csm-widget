import { type HandlerThis, type StateCtx } from './types';

export const withExtraOperators = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noIds.length === 0)
    throw new Error('withExtraOperators requires withOperator to run first');

  const extraGates = ctx.gates.slice(ctx.noIds.length);
  if (extraGates.length === 0)
    throw new Error('withExtraOperators requires a spare gate in the preset');

  const noIds = [...ctx.noIds];
  for (const gate of extraGates) {
    const noId = await this.fork.createCuratedOperator(gate, ctx.address);
    if (noId === undefined)
      throw new Error(`Extra operator was not created via gate "${gate}"`);
    noIds.push(noId);
  }

  return { noIds };
};
