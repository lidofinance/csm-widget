import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const LOGGER = path.join(__dirname, 'log-environment-variables.mjs');
const ENV_KEYS = path.join(__dirname, 'env-keys.cjs');

const ROOT_FILES = [
  'next.config.mjs',
  'server.mjs',
  'env-dynamics.mjs',
  'next-logger.config.cjs',
];
const SCAN_DIRS = [
  'scripts',
  'config',
  'utilsApi',
  'utils',
  'pages',
  'modules',
  'shared',
  'features',
  'consts',
];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs']);
const EXCLUDED_DIRS = new Set(['node_modules', '__mocks__']);

const NOT_LOGGED = new Set([
  'NODE_ENV',
  'PORT',
  'ANALYZE_BUNDLE',
  'NODE_NO_BUILD_DYNAMICS',
  'RUN_SECRET_ENV_LOGGING',
  'SURVEYS_OPENAPI_URL',
]);

type EnvRead = { key: string; location: string };

const collectFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return EXCLUDED_DIRS.has(entry.name) ? [] : collectFiles(full);
    }
    const isSource = EXTENSIONS.has(path.extname(entry.name));
    const isTest = /\.(test|spec)\./.test(entry.name);
    return isSource && !isTest && full !== LOGGER && full !== ENV_KEYS
      ? [full]
      : [];
  });

const scanEnvReads = (): EnvRead[] => {
  const files = [
    ...ROOT_FILES.map((file) => path.join(ROOT, file)).filter((file) =>
      fs.existsSync(file),
    ),
    ...SCAN_DIRS.flatMap((dir) => {
      const full = path.join(ROOT, dir);
      return fs.existsSync(full) ? collectFiles(full) : [];
    }),
  ];

  return files.flatMap((file) => {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    return lines.flatMap((line, index) =>
      Array.from(
        line.matchAll(
          /process\.env(?:\.([A-Z0-9_]+)|\[['"]([A-Z0-9_]+)['"]\])/g,
        ),
        (match) => ({
          key: match[1] ?? match[2],
          location: `${path.relative(ROOT, file)}:${index + 1}`,
        }),
      ),
    );
  });
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const envKeys = require('./env-keys.cjs') as { key: string }[];
const listedKeys = new Set(envKeys.map(({ key }) => key));

const reads = scanEnvReads();
const readKeys = new Set(reads.map(({ key }) => key));

describe('log-environment-variables', () => {
  it.each(Array.from(readKeys).sort())(
    'env key %s that the runtime reads is logged or explicitly not logged',
    (key) => {
      const where = reads
        .filter((read) => read.key === key)
        .map(({ location }) => location)
        .join(', ');
      expect({
        key,
        listed: listedKeys.has(key) || NOT_LOGGED.has(key),
        where,
      }).toEqual({ key, listed: true, where });
    },
  );

  it.each(Array.from(listedKeys))(
    'listed key %s is read by the runtime',
    (key) => {
      expect(readKeys.has(key)).toBe(true);
    },
  );
});

describe('logging missing env vars', () => {
  const run = (fn: string, env: Record<string, string>) => {
    const { stdout, stderr } = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { ${fn} } from ${JSON.stringify(LOGGER)}; ${fn}();`,
      ],
      { env: { PATH: process.env.PATH, ...env }, encoding: 'utf8' },
    );
    return stdout + stderr;
  };

  it('reports missing EL_RPC_URLS_1 as optional off mainnet', () => {
    const out = run('logSecretEnvironmentVariables', {
      DEFAULT_CHAIN: '560048',
    });
    expect(out).toContain('Secret EL_RPC_URLS_1 - not set (optional)');
    expect(out).not.toContain('Secret EL_RPC_URLS_1 - ERROR');
  });

  it('reports missing EL_RPC_URLS_1 as ERROR on mainnet', () => {
    const out = run('logSecretEnvironmentVariables', { DEFAULT_CHAIN: '1' });
    expect(out).toContain(
      'Secret EL_RPC_URLS_1 - ERROR (not exist in process.env)',
    );
  });

  it('reports missing MODULE as optional', () => {
    const out = run('logOpenEnvironmentVariables', {});
    expect(out).toContain('MODULE - not set (optional)');
  });
});
