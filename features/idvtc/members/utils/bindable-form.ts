import type { IdvtcResponseDto } from '../../shared/types';

// Mirrors the backend `MembersService.initFromIdvtc` lookup: the connected
// address can initialize members only from an APPROVED form that has not yet
// been bound to any operator. Anything else (no form, REVIEW, REJECTED, or a
// form already bound) is not bindable.
export const isBindableForm = (
  form?: Pick<IdvtcResponseDto, 'status' | 'boundToNodeOperatorId'>,
): boolean => form?.status === 'APPROVED' && !form.boundToNodeOperatorId;
