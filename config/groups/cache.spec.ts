import fs from 'fs';
import path from 'path';
import {
  CACHE_MIGALABS_RATE_HEADERS,
  CACHE_DEFAULT_HEADERS,
  CACHE_VALIDATION_HEADERS,
  CACHE_CL_HEADERS,
  CACHE_NO_STORE_HEADERS,
} from './cache';

// RFC 9111 (HTTP Caching) + RFC 5861 (stale-if-error / stale-while-revalidate)
const VALID_DIRECTIVES = new Set([
  'public',
  'private',
  'no-cache',
  'no-store',
  'must-revalidate',
  'proxy-revalidate',
  'immutable',
  'max-age',
  's-maxage',
  'stale-while-revalidate',
  'stale-if-error',
  'no-transform',
  'must-understand',
]);

const VALUE_DIRECTIVES = new Set([
  'max-age',
  's-maxage',
  'stale-while-revalidate',
  'stale-if-error',
]);

const parseDirectives = (header: string) =>
  header.split(',').map((directive) => {
    const [name, value] = directive.split('=').map((s) => s.trim());
    return { name, value };
  });

const getUnknownDirectives = (header: string) =>
  parseDirectives(header)
    .filter(({ name }) => !VALID_DIRECTIVES.has(name))
    .map(({ name }) => name);

const getMalformedValueDirectives = (header: string) =>
  parseDirectives(header)
    .filter(
      ({ name, value }) =>
        VALUE_DIRECTIVES.has(name) && !/^\d+$/.test(value ?? ''),
    )
    .map(({ name }) => name);

describe('cache-control headers', () => {
  it.each([
    ['CACHE_MIGALABS_RATE_HEADERS', CACHE_MIGALABS_RATE_HEADERS],
    ['CACHE_DEFAULT_HEADERS', CACHE_DEFAULT_HEADERS],
    ['CACHE_VALIDATION_HEADERS', CACHE_VALIDATION_HEADERS],
    ['CACHE_CL_HEADERS', CACHE_CL_HEADERS],
    ['CACHE_NO_STORE_HEADERS', CACHE_NO_STORE_HEADERS],
  ])(
    '%s uses only valid directives with well-formed values',
    (_name, header) => {
      expect(getUnknownDirectives(header)).toEqual([]);
      expect(getMalformedValueDirectives(header)).toEqual([]);
    },
  );
});

describe('sentinel header agreement between next.config.mjs and server.mjs', () => {
  // Read as text, not import: next.config.mjs regenerates public/runtime on
  // evaluation, and both files have module-level side effects.
  const nextConfigSource = fs.readFileSync(
    path.resolve(__dirname, '../../next.config.mjs'),
    'utf-8',
  );
  const serverSource = fs.readFileSync(
    path.resolve(__dirname, '../../server.mjs'),
    'utf-8',
  );

  const extractLiteral = (source: string, name: string) =>
    source.match(new RegExp(`${name}\\s*=\\s*'([^']*)'`))?.[1];

  it('CACHE_CONTROL_HEADER sentinel matches in both files', () => {
    const nextConfigHeader = extractLiteral(
      nextConfigSource,
      'CACHE_CONTROL_HEADER',
    );
    const serverHeader = extractLiteral(serverSource, 'CACHE_CONTROL_HEADER');

    expect(nextConfigHeader).toBeDefined();
    // A mismatch here silently disables all document caching: next.config.mjs
    // sets the sentinel header, but server.mjs's shim never renames it to
    // Cache-Control, so Next's SSR default (private, no-cache, ...) wins.
    expect(serverHeader).toBe(nextConfigHeader);
  });

  it('CACHE_CONTROL_VALUE uses only valid directives with well-formed values', () => {
    const cacheControlValue = extractLiteral(
      nextConfigSource,
      'CACHE_CONTROL_VALUE',
    );

    expect(cacheControlValue).toBeDefined();
    expect(getUnknownDirectives(cacheControlValue as string)).toEqual([]);
    expect(getMalformedValueDirectives(cacheControlValue as string)).toEqual(
      [],
    );
  });
});

describe('CACHE_CONTROL_PAGES covers every route in pages/', () => {
  const nextConfigSource = fs.readFileSync(
    path.resolve(__dirname, '../../next.config.mjs'),
    'utf-8',
  );

  const cacheControlPagesBody =
    nextConfigSource.match(/CACHE_CONTROL_PAGES\s*=\s*\[([\s\S]*?)\];/)?.[1] ??
    '';
  const entries = (cacheControlPagesBody.match(/'([^']*)'/g) ?? []).map((s) =>
    s.slice(1, -1),
  );

  it('extracted at least one entry', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  // api/test/error pages set their own policy; qa-config is getStaticProps
  const UNCACHED_ROUTES = new Set([
    'api',
    'test',
    'qa-config',
    '_app',
    '_document',
    '404',
    '500',
  ]);

  const dirents = fs.readdirSync(path.resolve(__dirname, '../../pages'), {
    withFileTypes: true,
  });

  const routes: [string, string][] = dirents
    .map((dirent): [string, string] | undefined => {
      const name = dirent.isDirectory()
        ? dirent.name
        : dirent.name.replace(/\.tsx$/, '');

      if (UNCACHED_ROUTES.has(name)) return undefined;

      if (dirent.isDirectory()) return [name, `/${name}/:path*`];
      if (name === 'index') return [name, '/'];
      return [name, `/${name}`];
    })
    .filter((route): route is [string, string] => route !== undefined);

  it.each(routes)('%s -> %s is present in CACHE_CONTROL_PAGES', (
    _name,
    expectedEntry,
  ) => {
    expect(entries).toContain(expectedEntry);
  });
});
