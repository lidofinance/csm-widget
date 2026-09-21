import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

// Relative imports on purpose: `from 'config'` here creates an import cycle.
import { config } from '../get-config';
import { secretConfig } from '../get-secret-config';
import { buildContentSecurityPolicy } from './policy.mjs';

export const contentSecurityPolicy: ContentSecurityPolicyOption =
  buildContentSecurityPolicy({
    developmentMode: config.developmentMode,
    ipfsMode: config.ipfsMode,
    trustedHosts: secretConfig.cspTrustedHosts
      ? secretConfig.cspTrustedHosts.split(',')
      : [],
    reportUri: secretConfig.cspReportUri,
    reportOnly: secretConfig.cspReportOnly,
  });
