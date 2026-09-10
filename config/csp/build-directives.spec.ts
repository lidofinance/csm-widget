import { buildCspDirectives, CspBuildOptions } from './build-directives';

const base: CspBuildOptions = {
  ipfsMode: false,
  developmentMode: false,
  trustedHosts: ['https://*.lido.fi'],
  reportUri: 'https://csm.lido.fi/api/csp-report',
};

const build = (patch: Partial<CspBuildOptions> = {}) =>
  buildCspDirectives({ ...base, ...patch });

describe('buildCspDirectives', () => {
  it('keeps the production script-src allowlist', () => {
    expect(build().scriptSrc).toEqual([
      "'self'",
      "'unsafe-inline'",
      "'wasm-unsafe-eval'",
      'https://*.lido.fi',
    ]);
  });

  it('adds unsafe-eval and ws: only in development mode', () => {
    const dev = build({ developmentMode: true });
    expect(dev.scriptSrc).toContain("'unsafe-eval'");
    expect(dev.connectSrc).toContain('ws:');
    expect(build().scriptSrc).not.toContain("'unsafe-eval'");
    expect(build().connectSrc).not.toContain('ws:');
  });

  it('sets frame-ancestors, report-uri and base-uri only outside IPFS mode', () => {
    const http = build();
    expect(http.frameAncestors).toEqual(['*']);
    expect(http.reportURI).toBe(base.reportUri);
    expect(http['base-uri']).toEqual(["'none'"]);

    const ipfs = build({ ipfsMode: true });
    expect(ipfs.frameAncestors).toBeUndefined();
    expect(ipfs.reportURI).toBeUndefined();
    expect(ipfs['base-uri']).toBeUndefined();
  });

  it('omits report-uri when none configured', () => {
    expect(build({ reportUri: undefined }).reportURI).toBeUndefined();
  });

  it('keeps worker-src none (nothing spawns workers)', () => {
    expect(build().workerSrc).toEqual(["'none'"]);
  });
});
