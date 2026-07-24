import { config } from 'config';
import { readSavedUserConfig } from 'config/user-config/saved-config';
import { getExternalLinks } from 'consts/external-links';

// Resolved once at module load. Read order: localStorage QA override (set on
// the qa-config page) → `process.env.SURVEYS_API_URL` (via env-dynamics) →
// per-chain `getExternalLinks().surveyApi` default. The QA override applies
// only after a page reload, matching the qa-config form's behavior.
// May be undefined when surveys are disabled in this env; transport invariants.
export const SURVEYS_API_BASE_URL: string | undefined =
  readSavedUserConfig().surveyApiUrl ||
  config.surveysApiUrl ||
  getExternalLinks().surveyApi;

export const isSurveysApiConfigured = Boolean(SURVEYS_API_BASE_URL);
