// Shared library for visual-verify: launches a browser with the csm-dev-wallet
// extension, connects as a given address/operator on the running app, and exposes
// the wallet controller for richer flows. Keep this dependency-light and the connect
// flow in ONE place so every script (and future agent) inherits the same verified path.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = join(HERE, '..');
const CACHE_DIR = join(SKILL_DIR, '.cache');
const DEV_WALLET_VERSION = '^2.3.0';
const DIST_DIR = join(CACHE_DIR, 'dist');
const DIST_ENTRY = join(DIST_DIR, 'playwright/index.js');
const FULL_INSTALL_ENTRY = join(CACHE_DIR, 'node_modules/csm-dev-wallet/dist/playwright/index.js');

export const ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';
export const HOODI = 560048;

let LOG_STDERR = false;
// Route progress logs to stderr instead of stdout. --json callers enable this so stdout carries ONLY
// the JSON payload (data on stdout, diagnostics on stderr — the conventional split).
export const setQuietLogs = (v = true) => {
  LOG_STDERR = v;
};
export const log = (...a) =>
  LOG_STDERR
    ? process.stderr.write(`[visual-verify] ${a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')}\n`)
    : console.info('[visual-verify]', ...a);

// Named viewport presets (logical px). Callers pass a preset name or an explicit "WIDTHxHEIGHT".
export const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};
export const resolveViewport = (spec) => {
  if (!spec) return null;
  if (VIEWPORTS[spec]) return { name: spec, ...VIEWPORTS[spec] };
  const m = String(spec).match(/^(\d+)x(\d+)$/i);
  if (m) return { name: spec, width: Number(m[1]), height: Number(m[2]) };
  throw new Error(`Unknown viewport "${spec}" — use mobile|tablet|desktop or WIDTHxHEIGHT (e.g. 414x896)`);
};

// csm-dev-wallet isn't a project dependency (it's a dev/QA tool). Resolve it from the
// project if present; otherwise acquire it into an isolated cache so we never mutate the
// repo's package.json/node_modules. We only need the prebuilt `dist/` (~712KB: the
// extension + the Playwright helper), NOT the package's heavy build deps (react/viem/two
// Lido SDKs, ~149MB). At runtime `dist/playwright/index.js` imports only path/url + a bare
// `import 'playwright'` — which Node resolves UP the tree to the repo's existing install —
// so fetching just the tarball and extracting `dist/` is enough, and ~30s faster.
export const loadDevWallet = async () => {
  // 1. Project devDep, if ever added. Cheapest path; let Node's resolver handle it.
  try {
    return await import('csm-dev-wallet/playwright');
  } catch {
    /* fall through to cache */
  }
  // 2. Already-extracted dist in the cache → instant on repeat runs.
  if (existsSync(DIST_ENTRY)) {
    return import(pathToFileURL(DIST_ENTRY).href);
  }
  // 3. Lean first run: pack the tarball, extract only `package/dist`.
  try {
    return await fetchDistOnly();
  } catch (e) {
    // 4. Self-heal: if the lean import fails because a *future* helper version grew a new
    //    runtime dependency (bare import that isn't in the repo's tree), fall back to a full
    //    `npm install` so its node_modules are present. Only triggers on real dependency
    //    drift — the common case stays lean.
    if (e?.code !== 'ERR_MODULE_NOT_FOUND') throw e;
    log(`lean dist is missing a runtime dependency (${e.message.split('\n')[0]}) — falling back to full install`);
    return fullInstall();
  }
};

// Fetch just the published tarball and extract its `dist/` into CACHE_DIR/dist, then import
// the helper. `npm pack` downloads the .tgz without touching node_modules; `tar --strip-components=1
// package/dist` lands `package/dist/playwright` → CACHE_DIR/dist/playwright and likewise for
// the extension, so the helper's `resolve(__dirname, "../extension")` points at CACHE_DIR/dist/extension.
const fetchDistOnly = async () => {
  log(`csm-dev-wallet not found — fetching ${DEV_WALLET_VERSION} dist into ${CACHE_DIR} (one-time, lean)…`);
  mkdirSync(CACHE_DIR, { recursive: true });
  // execFileSync (no shell): args as an array so versions/paths can't be read as shell metacharacters.
  // --silent so the only stdout is the produced filename; trim CR/whitespace npm may append.
  const tgzName = execFileSync(
    'npm',
    ['pack', `csm-dev-wallet@${DEV_WALLET_VERSION}`, '--pack-destination', CACHE_DIR, '--silent'],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n')
    .pop()
    .trim();
  // Prefer npm's reported name; fall back to globbing the .tgz in CACHE_DIR if stdout was empty.
  const tgz = tgzName && existsSync(join(CACHE_DIR, tgzName))
    ? join(CACHE_DIR, tgzName)
    : join(CACHE_DIR, readdirSync(CACHE_DIR).find((f) => f.endsWith('.tgz')) ?? '');
  if (!existsSync(tgz)) throw new Error(`npm pack produced no .tgz in ${CACHE_DIR}`);
  try {
    execFileSync('tar', ['-xzf', tgz, '-C', CACHE_DIR, '--strip-components=1', 'package/dist'], { stdio: 'inherit' });
  } finally {
    rmSync(tgz, { force: true }); // the tarball is throwaway once dist/ is extracted
  }
  if (!existsSync(DIST_ENTRY)) throw new Error(`extracted dist missing ${DIST_ENTRY}`);
  return import(pathToFileURL(DIST_ENTRY).href);
};

// Full dependency install — the original behaviour, kept as a self-healing fallback for the
// rare case the helper gains a runtime dep the repo doesn't already provide.
const fullInstall = () => {
  log(`installing ${DEV_WALLET_VERSION} (full deps) into ${CACHE_DIR}…`);
  mkdirSync(CACHE_DIR, { recursive: true });
  execFileSync(
    'npm',
    ['install', `csm-dev-wallet@${DEV_WALLET_VERSION}`, '--prefix', CACHE_DIR, '--no-audit', '--no-fund', '--silent'],
    { stdio: 'inherit' },
  );
  return import(pathToFileURL(FULL_INSTALL_ENTRY).href);
};

const moduleKeys = (role) =>
  role === 'rewards' ? 'rewardsAddress' : role === 'owner' ? 'ownerAddress' : 'managerAddress';

// Detect which module (csm/cm) and chain the target app is serving, straight from its SSR HTML
// (__NEXT_DATA__ carries publicRuntimeConfig.module + defaultChain). This lets a single command
// target any instance — localhost:3000 (CSM), localhost:3001 (CM), csm.testnet.fi, cm.testnet.fi —
// without the caller having to know/match the module or chain, which would otherwise show the wrong
// operators or an "unsupported chain". Explicit overrides win; this only fills the gaps.
export const detectAppConfig = async (origin) => {
  try {
    const html = await (await fetch(origin)).text();
    const module = (html.match(/"module":"(CSM|CM)"/i)?.[1] || 'CSM').toLowerCase();
    const chainId = Number(html.match(/"defaultChain":(\d+)/)?.[1]) || HOODI;
    return { module, chainId };
  } catch (e) {
    log(`could not detect app config from ${origin} (${e.message}); assuming csm/${HOODI}`);
    return { module: 'csm', chainId: HOODI };
  }
};

// Navigate with retries + an app-readiness wait. The local dev server cold-compiles on first hit and
// can hang past `domcontentloaded` (the event never fires) or briefly serve 404 chunks — a single
// plain goto then just times out. Instead: `commit` the navigation (resolves as soon as the response
// starts, not blocked on a slow/stuck load), then wait for the app shell to actually render (the
// connect button, the account chip, or — when a connected wallet manages 2+ operators and no cached
// pick matches one of them — the mandatory operator-selection prompt, since the app shell is
// deliberately hidden while that prompt is open). On failure, retry the whole navigation — a fresh
// goto picks up freshly-compiled chunks once the server settles. Used for the first load and every
// route change.
const APP_READY = '[data-testid="connectBtn"], [data-testid="accountSectionHeader"], [data-testid="selectModalOperatorRow"]';
export const gotoReady = async (page, url, { attempts = 3, navTimeout = 25000, readyTimeout = 25000 } = {}) => {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: navTimeout });
      await page.waitForSelector(APP_READY, { state: 'visible', timeout: readyTimeout });
      if (i > 1) log(`navigate ${url}: ready on attempt ${i}`);
      return;
    } catch (e) {
      lastErr = e;
      log(`navigate ${url}: attempt ${i}/${attempts} not ready (${e.message.split('\n')[0]})${i < attempts ? ' — retrying' : ''}`);
      if (i < attempts) await page.waitForTimeout(1500 * i);
    }
  }
  throw new Error(
    `App at ${url} never became ready after ${attempts} attempts — the dev server may still be compiling or serving stale 404 chunks. Re-run, or restart "yarn dev". (last: ${lastErr?.message?.split('\n')[0]})`,
  );
};

// Capture page-health signals for the whole session: console errors, uncaught exceptions, failed
// requests, and 4xx/5xx responses. This catches "looks fine but is broken" pages — e.g. a dev server
// serving 404 chunks (invisible in a screenshot) or a runtime error that blanked a card. Extension/
// data/blob URLs and benign aborted requests (canceled by our navigations) are filtered so the signal
// stays app-relevant. Returns a live object the caller reads after the page settles.
export const attachDiagnostics = (page) => {
  const d = { consoleErrors: [], pageErrors: [], failedRequests: [], httpErrors: [] };
  const internal = (url = '') => /^(chrome-extension|data|blob|about):/.test(url);
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const text = m.text().slice(0, 400);
    if (!d.consoleErrors.some((e) => e.text === text)) d.consoleErrors.push({ text, location: m.location()?.url || undefined });
  });
  page.on('pageerror', (e) => {
    const text = String(e?.message || e).slice(0, 400);
    if (!d.pageErrors.includes(text)) d.pageErrors.push(text);
  });
  page.on('requestfailed', (r) => {
    const url = r.url();
    const error = r.failure()?.errorText || '';
    if (internal(url) || error === 'net::ERR_ABORTED') return; // ERR_ABORTED ≈ request canceled by a navigation/reload, not a real fault
    if (!d.failedRequests.some((x) => x.url === url)) d.failedRequests.push({ url, method: r.method(), error });
  });
  page.on('response', (r) => {
    const status = r.status();
    const url = r.url();
    if (status < 400 || internal(url)) return;
    if (!d.httpErrors.some((x) => x.url === url && x.status === status)) d.httpErrors.push({ url, status, method: r.request().method() });
  });
  return d;
};

// Roll diagnostics up into per-category counts + a total — for a one-line summary or a JSON field.
export const diagnosticsSummary = (d) => {
  const counts = {
    consoleErrors: d.consoleErrors.length,
    pageErrors: d.pageErrors.length,
    failedRequests: d.failedRequests.length,
    httpErrors: d.httpErrors.length,
  };
  return { total: Object.values(counts).reduce((a, b) => a + b, 0), counts };
};

// Open the app already connected as `address` (or as operator #`operatorId`'s `role` address).
// `origin` may be any instance (defaults to localhost:3000 / $APP_ORIGIN). module/chainId auto-detect
// from the app unless given. `selectPrompt: true` captures the mandatory operator-selection prompt
// instead of resolving it — see the flag's own comment below. Returns { context, wallet, page,
// diagnostics, address, operator, origin, module, chainId, theme, viewport }. Caller is responsible
// for context.close().
export const connectAs = async ({
  address,
  operatorId,
  role = 'manager',
  origin = ORIGIN,
  module,
  chainId,
  route = '/',
  headless = true,
  theme,
  viewport,
  connect = true,
  selectPrompt = false, // capture the operator-selection prompt instead of auto-resolving it
  onPage, // invoked (page, context, diagnostics) as soon as the page exists — lets callers
  //         screenshot the failure point even if a later step throws.
} = {}) => {
  const detected = await detectAppConfig(origin);
  module = (module ?? detected.module).toLowerCase();
  chainId = chainId ?? detected.chainId;
  log(`target ${origin} — module=${module} chain=${chainId}`);
  if (theme && !['light', 'dark'].includes(theme)) throw new Error('--theme must be light or dark');
  const vp = resolveViewport(viewport);

  const { launch } = await loadDevWallet();
  const { context, wallet } = await launch({ headless });
  await wallet.setup({ origin, network: chainId });

  const page = await context.newPage();
  const diagnostics = attachDiagnostics(page); // start collecting console/network health before any nav
  onPage?.(page, context, diagnostics); // hand refs to the caller now, so a failure mid-flow is still screenshot-able
  // Set viewport + color scheme BEFORE navigating so the page renders at the right size/theme from
  // the first paint. The app follows prefers-color-scheme, so emulateMedia drives the theme without
  // touching the toggler (which can be hidden behind a menu at narrow viewports).
  if (vp) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    log(`viewport ${vp.name} (${vp.width}x${vp.height})`);
  }
  if (theme) await page.emulateMedia({ colorScheme: theme });

  // `connect: false` captures the genuine disconnected/welcome state — no account, no modal, no operator.
  // Otherwise we connect by SEEDING the exact localStorage wagmi/reef-knot persist after a real connect,
  // so the app auto-reconnects the injected wallet on load — skipping the connectBtn/terms/"Browser"
  // clicks. When the address is known upfront (--address) we seed before the first load (one load, no
  // modal); for --operator the address needs a page+RPC to resolve, so that case seeds and reloads below.
  // `connectModal` stays as a self-healing fallback if a seeded reconnect doesn't take (wagmi.store
  // schema bump, terms-version key drift, etc.).
  let target = connect ? address || null : null;
  if (target) {
    await wallet.setup({ origin, network: chainId, account: target }); // eth_accounts returns it from boot
    await seedConnection(context, { address: target, chainId });
  }
  if (selectPrompt) {
    // Force the prompt to reappear even if an earlier run cached a pick for this address: clear only
    // the `sm-`-prefixed keys the app writes the selection under, leaving the wagmi/reef-knot keys
    // seedConnection just wrote intact — otherwise the app wouldn't reconnect at all.
    await context.addInitScript(() => {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('sm-'))
          .forEach((k) => localStorage.removeItem(k));
      } catch {
        /* localStorage unavailable on this page — harmless */
      }
    });
  }
  await gotoReady(page, origin);

  if (connect) {
    try {
      await wallet.setRpcUrl(page, chainId, `${origin}/api/rpc`);
    } catch (e) {
      log('setRpcUrl warn:', e.message);
    }

    if (!target && operatorId != null) {
      // Operator addresses depend on module (CSM/CM differ). refreshOperators pulls live data via the
      // app's RPC proxy; on a just-started/recompiling dev server it can come back empty, making
      // getOperator throw "not found" — retry once with an explicit rpcUrl, then a clear error.
      let op = null;
      for (let attempt = 0; attempt < 2 && !op; attempt++) {
        await wallet.refreshOperators(page, chainId, module, attempt ? `${origin}/api/rpc` : undefined).catch(() => {});
        op = await wallet.getOperator(page, String(operatorId), chainId, module).catch(() => null);
      }
      if (!op) {
        throw new Error(`Could not load ${module} operator #${operatorId} from ${origin} — is the app fully started and is #${operatorId} a valid ${module} operator? (try scripts/operators.mjs to list valid ids)`);
      }
      target = op[moduleKeys(role)];
      if (!target) throw new Error(`Operator #${operatorId} has no ${role} address`);
      log(`${module} operator #${operatorId} ${role} = ${target}`);
      await wallet.switchAccount(page, target);
      await seedConnection(context, { address: target, chainId });
      await gotoReady(page, origin); // reload so wagmi boots with the seeded connection
    }
    if (!target) throw new Error('Provide { address } or { operatorId } (or connect:false to capture the disconnected state)');

    // Confirm the seeded reconnect actually connected; otherwise fall back to the proven modal flow.
    if (await isConnected(page)) {
      log('connected via seeded session (modal skipped)');
    } else {
      log('seeded reconnect did not take — using the connect modal');
      await wallet.switchAccount(page, target);
      await connectModal(page);
    }

    // Only now is the wallet definitely connected, so the selection prompt (if this wallet needs one)
    // has had its chance to render — resolving any earlier races the operators query.
    if (!selectPrompt) await resolveOperatorSelection(page, operatorId);
  }

  if (route && route !== '/') {
    await gotoReady(page, origin + route);
    if (connect && !selectPrompt) await resolveOperatorSelection(page, operatorId);
  }
  await settle(page);

  // Connecting "as operator N" only pins the wallet ADDRESS. If that address manages several
  // operators, the app shows a default (the first / last-cached one), which may not be N — so
  // switch the in-app operator selection to N and confirm. Done last, on the final route page,
  // because the selection is connection-scoped and a fresh navigation resets it to the default.
  let operator = null;
  if (connect && !selectPrompt) {
    operator = await currentOperatorId(page);
    if (operatorId != null && operator !== String(operatorId)) {
      operator = (await ensureOperator(page, operatorId)).operator;
    }
  }
  // Verify the theme took (and fall back to the toggler if emulateMedia were ever ignored).
  if (theme) await ensureTheme(page, theme);
  return { context, wallet, page, diagnostics, address: target, operator, origin, module, chainId, theme, viewport: vp?.name };
};

// The verified connect flow: connectBtn -> accept Terms checkbox -> pick the injected
// "Browser" wallet -> wait for the header account chip. The Terms checkbox gates the
// wallet buttons, and the injected provider shows up as "Browser" (the browserExtension
// connector), not by the wallet's own name.
export const connectModal = async (page) => {
  await page.getByTestId('connectBtn').first().click();
  await page.waitForTimeout(700);
  const cb = page.getByRole('checkbox').first();
  if (await cb.isVisible({ timeout: 1500 }).catch(() => false)) {
    if (!(await cb.isChecked().catch(() => false))) {
      await cb.check({ force: true }).catch(() => cb.click({ force: true }));
    }
  }
  await page.waitForTimeout(300);
  await page.locator('button, [role="button"], a').filter({ hasText: /^Browser/ }).first().click();
  if (!(await isConnected(page, 20000))) {
    throw new Error('connect modal did not produce a connected session (no account chip, no operator-selection prompt)');
  }
};

// Is a wallet currently connected? Used to confirm a seeded reconnect. True for the normal shell
// (header account chip) AND for a pending operator-selection prompt — that prompt replaces the shell
// while it is open, so waiting only for the chip would read a connected wallet as disconnected.
export const isConnected = (page, timeout = 15000) =>
  page
    .waitForFunction(
      () =>
        !!(
          document.querySelector('[data-testid="accountSectionHeader"]') ||
          document.querySelector('[data-testid="selectModalOperatorRow"]')
        ),
      { timeout },
    )
    .then(() => true)
    .catch(() => false);

// Seed the EXACT localStorage that wagmi + reef-knot persist after a real connect (captured from a live
// session), so the app auto-reconnects the injected "browserExtension" connector on the next load —
// no connectBtn/terms/"Browser" clicks. Registered via addInitScript, so it lands before the app's JS
// on every navigation in this context. Format notes: reef-knot terms flag is a raw `true`; the wagmi
// connector ids are JSON strings; `wagmi.store` encodes its `connections` Map as {__type:'Map', value}
// keyed by a connection uid that must match `current` and the connector's `uid`. If wagmi/reef-knot bump
// these shapes, the seeded reconnect simply won't take and connectAs falls back to the modal.
export const seedConnection = async (context, { address, chainId }) => {
  const uid = 'vv-seeded-connection';
  const store = {
    state: {
      connections: {
        __type: 'Map',
        value: [[uid, { accounts: [address], chainId, connector: { id: 'browserExtension', name: 'Browser', type: 'injected', uid } }]],
      },
      chainId,
      current: uid,
    },
    version: 3,
  };
  await context.addInitScript(
    ([storeJson]) => {
      try {
        localStorage.setItem('reef-knot_accept-terms_n2', 'true');
        localStorage.setItem('wagmi.recentConnectorId', '"browserExtension"');
        localStorage.setItem('wagmi.reef-knot_reconnect-wallet-id', '"browserExtension"');
        localStorage.setItem('wagmi.store', storeJson);
      } catch {
        /* localStorage unavailable on this page — harmless; modal fallback covers it */
      }
    },
    [JSON.stringify(store)],
  );
};

// After any navigation/reload/account-change the header chip re-renders asynchronously
// (wagmi reconnects, balances fetch). Wait for the header to resolve to connected OR
// disconnected before reading/screenshotting, otherwise you capture a blank chip.
export const settle = async (page, extraMs = 2500) => {
  await page
    .waitForFunction(
      () =>
        document.querySelector('[data-testid="accountSectionHeader"]') ||
        document.querySelector('[data-testid="connectBtn"]'),
      { timeout: 25000 },
    )
    .catch(() => {});
  await page.waitForTimeout(extraMs);
};

// Snapshot of what the app currently shows — handy for assertions/logging.
export const readState = (page) =>
  page.evaluate(() => {
    const t = (id) => document.querySelector(`[data-testid="${id}"]`)?.innerText?.replace(/\s+/g, ' ').trim() || null;
    return {
      url: location.pathname,
      connected: !document.querySelector('[data-testid="connectBtn"]'),
      account: t('accountSectionHeader'),
      operator: t('nodeOperatorHeader'),
      selectPrompt: !!document.querySelector('[data-testid="selectModalOperatorRow"]'),
    };
  });

// The numeric id of the operator the app currently shows (from the header chip), or null.
export const currentOperatorId = (page) =>
  page.evaluate(() => {
    const m = (document.querySelector('[data-testid="nodeOperatorHeader"]')?.innerText || '').match(/#(\d+)/);
    return m ? m[1] : null;
  });

// Resolve the mandatory "Select Node Operator" prompt the app opens when the connected wallet
// manages 2+ operators and no cached pick matches one of them. The whole row is the click target
// (there is no per-row button). Picks #operatorId when given, else the first row; no-op when no
// prompt is open, so it is safe to call after every navigation.
export const resolveOperatorSelection = async (page, operatorId) => {
  const rows = page.getByTestId('selectModalOperatorRow');
  if (!(await rows.first().isVisible({ timeout: 3000 }).catch(() => false))) {
    return { prompted: false, selected: null };
  }

  let target = rows.first();
  if (operatorId != null) {
    const want = String(operatorId);
    // `#318(?!\d)` so #31 / #3 don't match #318, and #318 doesn't match #3180.
    const match = rows.filter({ hasText: new RegExp(`#${want}(?!\\d)`) });
    if ((await match.count()) === 0) {
      const available = (await rows.allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
      throw new Error(`Operator #${want} not available for the connected address. Selection prompt shows: ${JSON.stringify(available)}`);
    }
    target = match.first();
  }

  const picked = (await target.innerText().catch(() => '')).match(/#(\d+)/)?.[1] ?? null;
  await target.click();
  await rows.first().waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  await settle(page);
  log(`selected operator #${picked} in the selection prompt`);
  return { prompted: true, selected: picked };
};

// Make the app's ACTIVE operator be #operatorId by driving the in-app switcher. No-op if it's
// already active. This changes only the app-level operator selection, not the wallet account —
// the connected address must manage that operator (else the switcher won't list it and we throw).
export const ensureOperator = async (page, operatorId) => {
  const want = String(operatorId);
  if ((await currentOperatorId(page)) === want) return { switched: false, operator: want };

  // The switcher lives in the header, which is hidden while the selection prompt is open — resolve
  // that first, and skip the switcher entirely when the prompt already landed on the wanted operator.
  const { selected } = await resolveOperatorSelection(page, operatorId);
  if (selected === want) return { switched: true, operator: want };

  const header = page.getByTestId('nodeOperatorHeader').first();
  if (!(await header.isVisible({ timeout: 5000 }).catch(() => false))) {
    throw new Error(`Cannot select operator #${want}: no operator switcher (is an operator connected?)`);
  }
  await header.click();
  const rows = page.getByTestId('switchModalOperatorRow');
  await rows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  // `#318(?!\d)` so #31 / #3 don't match #318, and #318 doesn't match #3180.
  const target = rows.filter({ hasText: new RegExp(`#${want}(?!\\d)`) });
  if ((await target.count()) === 0) {
    const available = (await rows.allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
    await page.keyboard.press('Escape').catch(() => {});
    throw new Error(`Operator #${want} not available for the connected address. Switcher shows: ${JSON.stringify(available)}`);
  }
  await target.first().getByRole('button', { name: 'Switch' }).click();
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape').catch(() => {}); // close modal if it didn't auto-close
  await settle(page);
  const operator = await currentOperatorId(page);
  if (operator !== want) log(`WARN: requested #${want} but header shows #${operator} after switch`);
  else log(`switched in-app to operator #${want}`);
  return { switched: true, operator };
};

// Detect the app's current theme from the perceived luminance of the page background (light ≈ 0.96,
// dark ≈ 0.11) — independent of any lido-ui/styled-components internals or DOM markers.
export const detectTheme = (page) =>
  page.evaluate(() => {
    const m = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
    if (!m) return null;
    const [r, g, b] = m.map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5 ? 'dark' : 'light';
  });

// Force the app into `desired` theme ('light'|'dark'). The app follows prefers-color-scheme, which
// connectAs sets via emulateMedia before load; this verifies it took and, as a fallback, clicks the
// header theme toggler (handles the unlikely case emulateMedia is ignored). Max two clicks.
export const ensureTheme = async (page, desired) => {
  for (let i = 0; i < 2; i++) {
    if ((await detectTheme(page)) === desired) return desired;
    const tog = page.getByTestId('themeToggler').first();
    if (!(await tog.isVisible({ timeout: 2000 }).catch(() => false))) break;
    await tog.click({ force: true });
    await page.waitForTimeout(800);
  }
  const got = await detectTheme(page);
  if (got !== desired) log(`WARN: requested ${desired} theme but page looks ${got}`);
  return got;
};
