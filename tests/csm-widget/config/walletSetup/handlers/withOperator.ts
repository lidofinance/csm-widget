import {
  type HandlerThis,
  type StateCtx,
} from 'tests/shared/config/walletSetup/types';

const INITIAL_KEYS = 1;

export const withOperator = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  const noId = await this.fork.createPermissionlessOperator(
    ctx.address,
    INITIAL_KEYS,
  );
  return { noId };
};
