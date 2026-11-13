import { type Address, zeroAddress } from 'viem';

export type ClaimerStageTitles = { sign: string; success: string };

export const CLAIMER_TOOLTIP =
  'Is an optional address authorized to trigger reward claims on your behalf. Unlike the Rewards Address, it does not receive the funds. It only initiates the claim transaction.';

export const getClaimerAddress = ({
  intent,
  address,
}: {
  intent?: string;
  address?: Address;
}): Address => (intent === 'unset' ? zeroAddress : (address ?? zeroAddress));

export const getClaimerStageTitles = (intent?: string): ClaimerStageTitles =>
  intent === 'unset'
    ? {
        sign: 'You are unsetting Rewards claimer',
        success: 'Rewards claimer has been unset',
      }
    : {
        sign: 'You are setting Rewards Claimer Address',
        success: 'Rewards Claimer Address has been set',
      };
