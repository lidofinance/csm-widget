import { type Address, isAddress, isAddressEqual } from 'viem';

export type ChangeRoleAction =
  'view' | 'manager-reset' | 'rewards-change' | 'propose' | 'accept';

export type ConfirmChangeRoleStep = 'rewards' | 'repropose';

export type ConfirmChangeRoleStepCopy = {
  title: string;
  body: string;
  hint?: string;
};

export type PendingChangeIntent = 'revoke' | 'accept';

export const getChangeRoleSubmitLabel = (
  action: ChangeRoleAction,
  roleTitle: string,
) =>
  action === 'propose'
    ? `Propose a new ${roleTitle} Address`
    : `Change ${roleTitle} Address`;

export const getConfirmChangeRoleSteps = ({
  showRewards,
  showRepropose,
}: {
  showRewards: boolean;
  showRepropose: boolean;
}): ConfirmChangeRoleStep[] => [
  ...(showRewards ? (['rewards'] as const) : []),
  ...(showRepropose ? (['repropose'] as const) : []),
];

export const getConfirmChangeRoleStepCopy = (
  step: ConfirmChangeRoleStep,
  isProposal: boolean,
): ConfirmChangeRoleStepCopy =>
  step === 'rewards'
    ? {
        title: isProposal
          ? 'All rewards will be claimable to the proposed address'
          : 'All rewards will be claimable to the new address',
        body: 'After changing the Rewards Address, all rewards and excess bond accumulated on the bond balance can be claimed to the new Rewards Address. In the event of validator withdrawal, the whole bond is also returned to the new address.',
        hint: isProposal
          ? 'The change doesn’t apply immediately. To complete the address change, the owner of the new address must confirm the change.'
          : undefined,
      }
    : {
        title: 'Only most recent proposed address change is valid',
        body: 'When you propose a new address for change - the previous change proposal is voided',
      };

export const getPendingChangeIntent = ({
  action,
  hasInvite,
}: {
  action: ChangeRoleAction;
  hasInvite: boolean;
}): PendingChangeIntent | undefined =>
  action === 'propose' ? 'revoke' : hasInvite ? 'accept' : undefined;

// The view state stays submittable only through the Accept intent
export const shouldRenderChangeRoleForm = ({
  action,
  hasInvite,
}: {
  action: ChangeRoleAction;
  hasInvite: boolean;
}) => action !== 'view' || hasInvite;

export const shouldShowGroupingNote = ({
  newAddress,
  address,
  currentAddress,
  otherRoleAddress,
}: {
  newAddress?: string;
  address: Address;
  currentAddress: Address;
  otherRoleAddress: Address;
}) =>
  !!newAddress &&
  isAddress(newAddress) &&
  !isAddressEqual(newAddress, address) &&
  isAddressEqual(currentAddress, address) &&
  !isAddressEqual(otherRoleAddress, address);
