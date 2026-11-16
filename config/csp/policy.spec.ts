import { buildCspDirectives, buildCspHeader } from './policy.mjs';

// copied from tests/csm-widget/tests/securityHeaders.spec.ts (prod)
const PROD_CSP =
  "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.reown.com; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://*.lido.fi; connect-src 'self' https: wss:; frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com; child-src 'self' https://*.walletconnect.org https://*.walletconnect.com; worker-src 'none'; object-src 'none'; media-src 'none'; manifest-src 'self'; script-src-attr 'none'; base-uri 'none'; form-action 'self'; frame-ancestors *; report-uri https://csm.lido.fi/api/csp-report";

const prodEnv = {
  trustedHosts: 'https://*.lido.fi',
  reportUri: 'https://csm.lido.fi/api/csp-report',
};

describe('buildCspHeader', () => {
  it('matches the header asserted by the e2e securityHeaders spec', () => {
    expect(buildCspHeader(prodEnv)).toEqual({
      name: 'Content-Security-Policy',
      value: PROD_CSP,
    });
  });

  it('uses the report-only header when CSP_REPORT_ONLY is set', () => {
    expect(buildCspHeader({ ...prodEnv, reportOnly: 'true' }).name).toBe(
      'Content-Security-Policy-Report-Only',
    );
  });

  it('omits report-uri when none configured', () => {
    expect(
      buildCspHeader({ trustedHosts: 'https://*.lido.fi' }).value,
    ).not.toContain('report-uri');
  });
});

describe('buildCspDirectives', () => {
  const d = buildCspDirectives({ trustedHosts: [] });

  it('keeps script-src without trusted hosts', () => {
    expect(d['script-src']).toEqual([
      "'self'",
      "'unsafe-inline'",
      "'wasm-unsafe-eval'",
    ]);
  });

  it('blocks workers, plugins, media and inline event handlers', () => {
    expect(d['worker-src']).toEqual(["'none'"]);
    expect(d['object-src']).toEqual(["'none'"]);
    expect(d['media-src']).toEqual(["'none'"]);
    expect(d['script-src-attr']).toEqual(["'none'"]);
  });

  it('restricts form submission and manifest to self', () => {
    expect(d['form-action']).toEqual(["'self'"]);
    expect(d['manifest-src']).toEqual(["'self'"]);
  });

  it('allows WalletConnect iframes via frame-src with child-src fallback', () => {
    const expected = [
      "'self'",
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
    ];
    expect(d['frame-src']).toEqual(expected);
    expect(d['child-src']).toEqual(expected);
  });
});
