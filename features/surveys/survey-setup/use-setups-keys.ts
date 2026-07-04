import {
  callSurvey,
  surveyRequest,
  useOperatorSurvey,
  type OperatorKey,
} from 'modules/surveys-sdk';
import { setupKeys, type KeysDto } from 'modules/surveys-sdk/generated';
import { SetupsKeys } from '../types';
import { transformKeysIncoming } from './transform';

// Aggregate setup key counts for an operator (`{ filled, total }` plus the
// derived `left`). Pass an explicit operatorKey for a delegated operator; omit
// it to use the connected operator.
export const useSetupsKeys = (operatorKey?: OperatorKey) =>
  useOperatorSurvey<SetupsKeys, KeysDto>('setups/keys', {
    operatorKey,
    transformIncoming: transformKeysIncoming,
    get: ({ nodeOperatorId, token, signal }) =>
      callSurvey(() =>
        setupKeys({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId },
        }),
      ),
  });
