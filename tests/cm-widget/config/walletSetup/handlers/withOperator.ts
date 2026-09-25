import {
  type HandlerThis,
  type StateCtx,
} from 'tests/shared/config/walletSetup/types';

export const withOperator = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  const noId = await this.fork.createCuratedOperator(ctx.gates[0], ctx.address);
  return { noId };
};
