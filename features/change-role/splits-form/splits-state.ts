import type { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { compareLowercase } from 'utils/compare-lowercase';

export type SplitsNotice =
  | 'canSetupBeforeFirstRewards'
  | 'unclaimedBeforeSetup'
  | 'disabledNoProof'
  | 'disabledUnclaimed'
  | 'disabledPending';

export type SplitsNoticeInput = {
  canEdit: boolean;
  splitsCount: number;
  proofLength: number;
  hasAvailable: boolean;
  hasPendingToSplit: boolean;
};

export type SplitsStageTexts = {
  sign: { title: string; description: string };
  success: { title: string; description: string };
};

export const BOND_ROW_DESCRIPTION =
  'This share of the rewards will be sent to the Node Operator’s bond';

export const splitsEqual = (a: Partial<FeeSplit>[], b: FeeSplit[]) =>
  a.length === b.length &&
  a.every(
    (s, i) =>
      compareLowercase(s.recipient, b[i].recipient) && s.share === b[i].share,
  );

// The cases are exclusive: canEdit already requires no pending shares
export const getSplitsNotice = ({
  canEdit,
  splitsCount,
  proofLength,
  hasAvailable,
  hasPendingToSplit,
}: SplitsNoticeInput): SplitsNotice | null => {
  if (canEdit && splitsCount === 0) {
    if (proofLength === 0) return 'canSetupBeforeFirstRewards';
    if (hasAvailable) return 'unclaimedBeforeSetup';
  }
  if (splitsCount > 0 && proofLength === 0) return 'disabledNoProof';
  if (splitsCount > 0 && hasAvailable) return 'disabledUnclaimed';
  if (hasPendingToSplit) return 'disabledPending';
  return null;
};

export const getSplitsSubmitLabel = (hasCurrentSplits: boolean) =>
  hasCurrentSplits ? 'Apply changes' : 'Save splits';

export const getSplitsActionLabel = (hasCurrentSplits: boolean) =>
  hasCurrentSplits ? 'Edit splitters' : 'Set up splits';

const recipients = (count: number) =>
  `${count} additional recipient${count > 1 ? 's' : ''}`;

export const getSplitsStageTexts = (count: number): SplitsStageTexts =>
  count === 0
    ? {
        sign: {
          title: 'You are removing fee splitter',
          description: 'All rewards will go to the Rewards Address',
        },
        success: {
          title: 'Fee splitter has been removed',
          description: 'All rewards will go to the Rewards Address',
        },
      }
    : {
        sign: {
          title: 'You are updating fee splitter configuration',
          description: `Setting ${recipients(count)}`,
        },
        success: {
          title: 'Fee splitter configuration has been updated',
          description: `${recipients(count)} configured`,
        },
      };
