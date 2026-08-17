#!/usr/bin/env node
// Open a route in the running app, connected as an address or operator, and screenshot it.
// Also captures page health (console errors, uncaught exceptions, failed + 4xx/5xx requests), so a
// page that LOOKS fine but is actually broken (e.g. serving 404 chunks) gets flagged, not just imaged.
//
// Examples:
//   node scripts/verify.mjs --operator 4 --route /                 # dashboard as operator #4 (local CSM)
//   node scripts/verify.mjs --operator 4 --role rewards --route /settings
//   node scripts/verify.mjs --address 0xd8dA…96045 --route /keys
//   node scripts/verify.mjs --url http://localhost:3001 --operator 2   # the CM instance
//   node scripts/verify.mjs --url https://cm.testnet.fi --operator 5   # a remote testnet
//   node scripts/verify.mjs --operator 4 --theme dark               # dark mode
//   node scripts/verify.mjs --operator 4 --viewport mobile          # mobile layout
//   node scripts/verify.mjs --operator 4 --json                     # machine-readable result on stdout
//   node scripts/verify.mjs --operator 4 --selector '[data-testid="accountSectionHeader"]'  # one element
//   node scripts/verify.mjs --no-connect --route /                  # disconnected/welcome state, no wallet
//   node scripts/verify.mjs --address 0x028913…e8de --select-prompt  # the mandatory Select Node Operator modal
//                                                                   # (clears the cached pick so it reappears)
//   node scripts/verify.mjs --operator 12 --headed --keep-open     # watch it live, leave open
//
// The module (csm/cm) and chain are auto-detected from whatever --url points at; override only if needed.
// Flags: --url <origin> | --operator N | --address 0x.. | --role manager|rewards|owner | --route /path
//        --theme light|dark | --viewport mobile|tablet|desktop|WxH | --selector <css> (shoot one element)
//        --no-connect (capture without a wallet) | --select-prompt (capture the operator-selection modal)
//        --out file.png
//        --json (structured result to stdout; logs to stderr) | --chain 560048 | --module csm|cm
//        --headed | --keep-open | --full
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectAs, readState, diagnosticsSummary, setQuietLogs, log } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, '..', '.cache', 'shots');

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? def : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

// On ANY failure, screenshot wherever we got stuck before reporting — a failure image (the modal that
// never opened, a blank card, the wrong page) is far more diagnostic than an error string alone.
const captureFailure = async (e, page, context, jsonMode) => {
  let shot = null;
  if (page) {
    try {
      mkdirSync(SHOTS, { recursive: true });
      shot = join(SHOTS, `FAILED-${Date.now()}.png`);
      await page.screenshot({ path: shot });
    } catch {
      shot = null; // a failure-screenshot failure must not mask the original error
    }
  }
  if (context) await context.close().catch(() => {});
  if (jsonMode) {
    process.stdout.write(JSON.stringify({ ok: false, error: e.message, screenshot: shot }) + '\n');
  } else {
    console.error('[visual-verify] FAILED:', e.message);
    if (shot) console.error('[visual-verify] failure screenshot ->', shot);
  }
  process.exit(1);
};

const main = async () => {
  const operatorId = flag('operator');
  const address = flag('address');
  const noConnect = has('no-connect');
  const selectPrompt = has('select-prompt');
  const selector = flag('selector');
  const jsonMode = has('json');
  if (jsonMode) setQuietLogs(true); // keep stdout clean for the JSON payload
  if (!noConnect && !operatorId && !address) {
    console.error('Provide --operator <id> or --address <0x…> (or --no-connect). See header of this file for examples.');
    process.exit(2);
  }
  if (selectPrompt && noConnect) {
    console.error('--select-prompt needs a connected wallet: pass --address <0x…> or --operator <id> instead of --no-connect.');
    process.exit(2);
  }
  const route = flag('route', '/');
  const headless = !has('headed');

  // page/context are captured via onPage the instant they exist, so captureFailure can screenshot the
  // exact failure point even if connectAs throws partway through (e.g. operator not found, modal hang).
  let context, page;
  try {
    const conn = await connectAs({
      operatorId,
      address,
      role: flag('role', 'manager'),
      origin: flag('url') || flag('origin'), // undefined -> lib default ($APP_ORIGIN / localhost:3000)
      chainId: flag('chain') ? Number(flag('chain')) : undefined, // undefined -> auto-detect
      module: flag('module'), // undefined -> auto-detect
      route,
      headless,
      theme: flag('theme'), // light|dark, undefined -> app default
      viewport: flag('viewport'), // mobile|tablet|desktop|WxH, undefined -> default
      connect: !noConnect, // --no-connect -> capture the disconnected/welcome state
      selectPrompt, // --select-prompt -> leave the operator-selection modal open instead of resolving it
      onPage: (p, c) => {
        page = p;
        context = c;
      },
    });
    const { diagnostics, module, theme, viewport, origin, chainId, address: account, operator } = conn;

    // Resolve output path AFTER connecting so the default name can include the detected module +
    // theme/viewport/selector variant — otherwise different variants would clobber each other.
    let out = flag('out');
    if (out) {
      if (!isAbsolute(out)) out = join(process.cwd(), out);
    } else {
      mkdirSync(SHOTS, { recursive: true });
      const who = noConnect ? 'disconnected' : operatorId ? `op${operatorId}-${flag('role', 'manager')}` : `addr-${address.slice(0, 8)}`;
      const selSlug = selector ? 'el_' + selector.replace(/[^a-z0-9]+/gi, '').slice(0, 20) : '';
      const variant = [theme, viewport, selSlug, selectPrompt ? 'selectprompt' : ''].filter(Boolean).join('-');
      out = join(SHOTS, `${module}-${who}${route.replace(/[^a-z0-9]+/gi, '_')}${variant ? '-' + variant : ''}.png`);
    }

    const state = await readState(page);
    log('STATE', JSON.stringify(state));
    // With --select-prompt the modal hides the header, so there is no active operator to confirm.
    if (!noConnect && !selectPrompt && operatorId != null) {
      const shown = (state.operator || '').match(/#(\d+)/)?.[1];
      log(shown === String(operatorId) ? `confirmed operator #${operatorId} is active` : `WARN: requested #${operatorId} but showing #${shown}`);
    }
    // --selector shoots a single element (scrolls it into view first); otherwise the page/viewport.
    if (selector) {
      const el = page.locator(selector).first();
      if (!(await el.isVisible({ timeout: 10000 }).catch(() => false))) {
        throw new Error(`--selector "${selector}" matched no visible element on ${state.url}`);
      }
      await el.screenshot({ path: out });
      log(`screenshot (element ${selector}) ->`, out);
    } else {
      await page.screenshot({ path: out, fullPage: has('full') });
      log('screenshot ->', out);
    }

    // Page-health report — flags broken-but-pretty pages (404 chunks, runtime errors, failed requests).
    const health = diagnosticsSummary(diagnostics);
    if (health.total === 0) {
      log('page health: clean (no console/network errors)');
    } else {
      const c = health.counts;
      log(`page health: ${health.total} issue(s) — ${c.consoleErrors} console, ${c.pageErrors} pageerror, ${c.failedRequests} failed-req, ${c.httpErrors} HTTP 4xx/5xx`);
      for (const er of diagnostics.pageErrors.slice(0, 10)) log(`  pageerror: ${er}`);
      for (const er of diagnostics.consoleErrors.slice(0, 10)) log(`  console: ${er.text}`);
      for (const r of diagnostics.httpErrors.slice(0, 10)) log(`  HTTP ${r.status}: ${r.url}`);
      for (const r of diagnostics.failedRequests.slice(0, 10)) log(`  failed (${r.error}): ${r.url}`);
    }

    if (jsonMode) {
      // Single JSON object on stdout (logs were routed to stderr). `health.total > 0` is the
      // machine-readable "this page has problems" signal even when the screenshot looks fine.
      process.stdout.write(
        JSON.stringify(
          { ok: true, origin, module, chainId, theme: theme || null, viewport: viewport || null, route, connected: !noConnect, selector: selector || null, address: account, operator, screenshot: out, state, health, diagnostics },
          null,
          2,
        ) + '\n',
      );
    }

    if (has('keep-open')) {
      log('--keep-open set; leaving browser open. Ctrl-C to exit.');
      await new Promise(() => {});
    }
    await context.close();
  } catch (e) {
    await captureFailure(e, page, context, jsonMode);
  }
};

main().catch((e) => {
  console.error('[visual-verify] FAILED:', e.message);
  process.exit(1);
});
