import {
  type HandlerThis,
  type StateCtx,
} from 'tests/shared/config/walletSetup/types';

const AMOUNT_ETH = '10';

export const withTokens = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  await this.fork.fundTokens(ctx.address, AMOUNT_ETH);
  return {};
};
