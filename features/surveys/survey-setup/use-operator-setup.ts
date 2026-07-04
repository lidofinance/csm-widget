import {
  callSurvey,
  surveyRequest,
  useOperatorSurvey,
  type OperatorKey,
} from 'modules/surveys-sdk';
import {
  setupCreate,
  setupDeleteOne,
  setupFindOne,
  setupUpdate,
  type SetupDto,
} from 'modules/surveys-sdk/generated';
import { Setup, SetupRaw } from '../types';
import { transformIncoming, transformOutgoing } from './transform';

type UseOperatorSetupOptions = {
  operatorKey?: OperatorKey;
  invalidateOnMutate?: boolean;
};

// Per-operator setup resource shared by the operator and delegator setup forms:
// a GET of one setup plus update and delete. `index` is the 1-based setup
// position to edit, or `undefined` to create a new one (which also gates the GET
// off). Edit → update the indexed setup; create → POST a new setup.
export const useOperatorSetup = (
  index: number | undefined,
  { operatorKey, invalidateOnMutate }: UseOperatorSetupOptions = {},
) =>
  useOperatorSurvey<Setup, SetupRaw>(
    index !== undefined ? `setups/${index}` : 'setups',
    {
      operatorKey,
      // GET only fires in edit mode — create has no index to read.
      skipFetching: index === undefined,
      invalidateOnMutate,
      transformIncoming,
      transformOutgoing,
      get: ({ nodeOperatorId, token, signal }) =>
        callSurvey(() =>
          setupFindOne({
            ...surveyRequest(token, signal),
            path: { nodeOperatorId, index: index ?? 0 },
          }),
        ),
      update: (body, { nodeOperatorId, token }) => {
        // transformOutgoing emits `mevMinBidWei: null` to CLEAR a bid, but the
        // generated SetupDto types the field as optional-string-only; bridge that
        // single-field gap here (the wire accepts the null).
        const requestBody = body as SetupDto;
        return index !== undefined
          ? callSurvey(() =>
              setupUpdate({
                ...surveyRequest(token),
                path: { nodeOperatorId, index },
                body: requestBody,
              }),
            )
          : callSurvey(() =>
              setupCreate({
                ...surveyRequest(token),
                path: { nodeOperatorId },
                body: requestBody,
              }),
            );
      },
      remove: async ({ nodeOperatorId, token }) => {
        await callSurvey(() =>
          setupDeleteOne({
            ...surveyRequest(token),
            path: { nodeOperatorId, index: index ?? 0 },
          }),
        );
      },
    },
  );
