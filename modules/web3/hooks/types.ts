import { MODULE_NAME, NodeOperatorInviteInfo } from '@lidofinance/lido-csm-sdk';

export type ModuleInvite = NodeOperatorInviteInfo & { module: MODULE_NAME };
