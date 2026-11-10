type InviteLike = { nodeOperatorId: number | bigint; role: string };

const ROLE_TITLE: Record<string, string> = {
  MANAGER: 'Manager Address',
  REWARDS: 'Rewards Address',
};

export const getIncomingRequestsCopy = (invites: readonly InviteLike[]) => {
  if (invites.length === 0) return null;
  if (invites.length > 1) {
    return 'Your connected address has been proposed as the Manager / Rewards Address for multiple Node Operators';
  }
  const [{ nodeOperatorId, role }] = invites;
  return `Your connected address has been proposed as the ${ROLE_TITLE[role] ?? 'Manager Address'} for Node Operator #${nodeOperatorId}`;
};
