import type { AlertDefinition, AlertType } from '../types';
import { claimIcsDefinition } from './claim-ics';
import { claimIdvtcDefinition } from './claim-idvtc';
import { exitRequestedDefinition } from './exit-requested';
import { expiredLockedBondDefinition } from './expired-locked-bond';
import { keyStrikeDefinition } from './key-strike';
import { lockedBondDefinition } from './locked-bond';
import { normalizeQueueDefinition } from './normalize-queue';
import { wrongFeeRecipientDefinition } from './wrong-fee-recipient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALERT_DEFINITIONS: { [T in AlertType]: AlertDefinition<any> } = {
  'exit-requested': exitRequestedDefinition,
  'locked-bond': lockedBondDefinition,
  'expired-locked-bond': expiredLockedBondDefinition,
  'key-strike': keyStrikeDefinition,
  'wrong-fee-recipient': wrongFeeRecipientDefinition,
  'normalize-queue': normalizeQueueDefinition,
  'claim-ics': claimIcsDefinition,
  'claim-idvtc': claimIdvtcDefinition,
};

export const severityOf = (type: AlertType) => ALERT_DEFINITIONS[type].severity;

export const suppressedOf = (type: AlertType) =>
  ALERT_DEFINITIONS[type].suppressedRoutes;
