// MUST match csm-survey-api members.service ownership message exactly.
// `operatorKey` is the raw route segment (e.g. 'csm-1'), not the numeric id.
export const generateMemberOwnershipMessage = (
  memberAddress: string,
  operatorKey: string,
): string =>
  `Verify ownership of address ${memberAddress.toLowerCase()} for IDVTC operator ${operatorKey}`;
