import { FC } from 'react';
import { AppProps } from 'next/app';
import { withSecureHeaders } from 'next-secure-headers';
import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

// Relative imports on purpose: `from 'config'` here creates an import cycle.
import { config } from '../get-config';
import { getServerConfig } from '../../utilsApi/server-config';
import { buildCspDirectives } from './build-directives';

const { cspTrustedHosts, cspReportUri, cspReportOnly } = getServerConfig();

const contentSecurityPolicy: ContentSecurityPolicyOption = {
  directives: buildCspDirectives({
    developmentMode: config.developmentMode,
    trustedHosts: cspTrustedHosts ? cspTrustedHosts.split(',') : [],
    reportUri: cspReportUri,
  }),
  reportOnly: cspReportOnly,
};

export const withCsp = (app: FC<AppProps>): FC =>
  withSecureHeaders({
    contentSecurityPolicy,
    // non-CSP headers are owned by next.config.mjs headers()
    frameGuard: false,
    forceHTTPSRedirect: false,
    noopen: false,
    expectCT: false,
    nosniff: false,
    referrerPolicy: false,
    // cannot be disabled in next-secure-headers 2.2.0; keep equal to next.config.mjs
    xssProtection: 'block-rendering',
  })(app);
