import { type HandlerThis, type StateCtx } from './types';

export const withDeposit = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withDeposit requires withOperator to run first');
  await this.fork.depositKeys(100);
  return {};
};
