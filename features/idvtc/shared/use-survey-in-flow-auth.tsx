import { useSiweAuth } from 'modules/siwe';
import { ReactElement, useCallback, useRef } from 'react';
import { useTransitStage } from 'shared/transaction-modal';

export type SurveyInFlowAuth = {
  // Ensure a SIWE token exists before the tx: shows `signinStage` in the tx
  // modal and resolves once signed. THROWS on user rejection — the caller
  // decides whether that aborts the flow (staged DKG files) or degrades it
  // (skip members auto-init).
  ensureAuth: (signinStage: ReactElement) => Promise<void>;
  getToken: () => string | undefined;
};

// One instance per flow: ensureAuth and the post-tx consumers (uploadStaged,
// initStaged) run inside the same flow callback, where the context `token`
// captured at render time is still the pre-sign-in value. The ref is kept
// current across renders and updated eagerly by ensureAuth, so getToken()
// always returns the fresh token.
export const useSurveyInFlowAuth = (): SurveyInFlowAuth => {
  const { token, authenticate } = useSiweAuth();
  const transitStage = useTransitStage();

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const ensureAuth = useCallback(
    async (signinStage: ReactElement): Promise<void> => {
      if (tokenRef.current) return;
      transitStage(signinStage);
      tokenRef.current = await authenticate();
    },
    [authenticate, transitStage],
  );

  const getToken = useCallback(() => tokenRef.current, []);

  return { ensureAuth, getToken };
};
