import {
  type HandlerThis,
  type StateCtx,
} from 'tests/shared/config/walletSetup/types';

const DEPOSIT_COUNT = 100;

export const withDepositedKeys = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  if (ctx.noId === undefined)
    throw new Error('withDepositedKeys requires withOperator to run first');
  await this.fork.depositKeys(DEPOSIT_COUNT);
  return {};
};
