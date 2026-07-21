import {
  callSurvey,
  surveyRequest,
  useSurveyStatus,
} from 'modules/surveys-sdk';
import { idvtcGetStatus } from 'modules/surveys-sdk/generated';
import type { IdvtcResponseDto } from '../../shared/types';
import { isBindableForm } from '../utils/bindable-form';

// Reuses the same address-scoped `idvtc/status` query as IdvtcStateProvider
// (identical cache key), so the members page reads the connected address's
// latest form without an extra request. `isBindable` is true only when that
// form can back a `POST /members/init` call.
export const useApprovedUnboundForm = () => {
  const { data, isPending } = useSurveyStatus<IdvtcResponseDto>(
    'idvtc/status',
    ({ token, signal }) =>
      callSurvey(() => idvtcGetStatus(surveyRequest(token, signal))),
  );

  return { isBindable: isBindableForm(data), isPending };
};
