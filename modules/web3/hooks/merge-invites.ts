import { MODULE_NAME, NodeOperatorInviteInfo } from '@lidofinance/lido-csm-sdk';

export type ModuleInvite = NodeOperatorInviteInfo & { module: MODULE_NAME };

type ModuleInvites = {
  module: MODULE_NAME;
  invites: NodeOperatorInviteInfo[];
};

export const mergeInvites = (results: ModuleInvites[]): ModuleInvite[] =>
  results.flatMap(({ module, invites }) =>
    invites.map((invite) => ({ ...invite, module })),
  );
