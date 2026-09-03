import { type HandlerThis, type StateCtx } from './types';

export const withDeposit = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  const [noId] = ctx.noIds;
  if (noId === undefined)
    throw new Error('withDeposit requires withOperator to run first');
  await this.fork.depositKeys(100);
  return {};
};
