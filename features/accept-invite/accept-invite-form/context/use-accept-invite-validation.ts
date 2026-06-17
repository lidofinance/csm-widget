import {
  useFormValidation,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import type {
  AcceptInviteFormInputType,
  AcceptInviteFormNetworkData,
} from './types';

export const useAcceptInviteValidation = () => {
  return useFormValidation<
    AcceptInviteFormInputType,
    AcceptInviteFormNetworkData
  >('invite', async ({ invite }) => {
    if (!invite) {
      throw new ValidationError(
        'invite',
        VALIDATION_MESSAGES.pleaseSelectInvite,
      );
    }
  });
};
