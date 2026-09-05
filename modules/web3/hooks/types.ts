import {
  CurveRef,
  GateItemEligibility,
  MODULE_NAME,
  NodeOperatorInviteInfo,
} from '@lidofinance/lido-csm-sdk';

export type ModuleInvite = NodeOperatorInviteInfo & { module: MODULE_NAME };

export type CuratedGateEligibility = GateItemEligibility & {
  curve: CurveRef<MODULE_NAME.CM>;
};
