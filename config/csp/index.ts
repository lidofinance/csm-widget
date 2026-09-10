import { FC } from 'react';
import { AppProps } from 'next/app';
import { withSecureHeaders } from 'next-secure-headers';
import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

// Relative imports on purpose: `from 'config'` here creates an import cycle.
import { config } from '../get-config';
import { secretConfig } from '../get-secret-config';
import { buildCspDirectives } from './build-directives';

export const contentSecurityPolicy: ContentSecurityPolicyOption = {
  directives: buildCspDirectives({
    ipfsMode: config.ipfsMode,
    developmentMode: config.developmentMode,
    trustedHosts: secretConfig.cspTrustedHosts
      ? secretConfig.cspTrustedHosts.split(',')
      : [],
    reportUri: secretConfig.cspReportUri,
  }),
  reportOnly: secretConfig.cspReportOnly,
};

export const withCsp = (app: FC<AppProps>): FC =>
  withSecureHeaders({
    contentSecurityPolicy,
    frameGuard: false,
    referrerPolicy: 'same-origin',
  })(app);
