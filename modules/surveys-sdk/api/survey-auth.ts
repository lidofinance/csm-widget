import type {
  SiweNonceResponse,
  SiweSigninPayload,
  SiweSigninResponse,
} from 'modules/siwe';
import invariant from 'tiny-invariant';
import { authGetNonce, authSignIn } from '../generated';
import { callSurvey, surveyRequest } from './survey-client';

// Public SIWE auth endpoints for the surveys API. These live here (next to
// `survey-client`) rather than in `surveys-api.ts` to avoid a circular import:
// `survey-client` already imports `SURVEYS_API_BASE_URL` from `surveys-api`, so
// routing these through `callSurvey` from inside `surveys-api` would close the
// loop. Keeping them on the client side breaks it.
//
// Both endpoints are PUBLIC (no token) and always return a 200 body. The shapes
// line up 1:1 with the generated DTOs: `AuthNonceDto` ≡ `SiweNonceResponse`,
// `AuthPersonalSignDto` ≡ `SiweSigninPayload`, `AuthSignInDto` ≡ `SiweSigninResponse`.
//
// `callSurvey` is typed `T | undefined` (it normalizes empty bodies to
// `undefined`), but these endpoints never return an empty body — we assert with
// `invariant` so the public signatures stay non-undefined.

// Public nonce endpoint — accepts no token. Pass directly to <SiweAuthProvider getNonce={...}>.
// Returns a server-issued, single-use nonce that must be embedded in the SIWE message.
export const surveysGetNonce = async (): Promise<SiweNonceResponse> => {
  const res = await callSurvey(() => authGetNonce(surveyRequest()));
  invariant(res, 'surveys-sdk: empty response from auth/nonce');
  return res;
};

// Public signin endpoint — accepts no token. Pass directly to <SiweAuthProvider signin={...}>.
export const surveysSignin = async (
  payload: SiweSigninPayload,
): Promise<SiweSigninResponse> => {
  const res = await callSurvey(() =>
    authSignIn({ ...surveyRequest(), body: payload }),
  );
  invariant(res, 'surveys-sdk: empty response from auth/signin');
  return res;
};
