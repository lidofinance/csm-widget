---
name: visual-verify
description: >-
  Use when you need to SEE, screenshot, preview, or visually QA how a page of the running CSM or CM
  widget looks — connected as a specific wallet address or node operator, or in the disconnected/welcome
  state — which a plain headless browser can't reach (it has no wallet). Opens the running app (localhost
  or a testnet URL), navigates any route, optionally in dark/light theme, a mobile/desktop viewport, or
  cropped to one element, and captures a screenshot plus any console/network errors. E.g. "show the
  dashboard as operator 4", "settings in dark mode", "the bond page on mobile", "screenshot the welcome
  screen", or "open cm.testnet.fi as operator 5". NOT for: writing unit/e2e tests, debugging
  connector/wallet code, building UI features, or comparing against Figma.
---

# Visual verification of the running app

This app is a Web3 dApp: every meaningful page requires a connected wallet. A vanilla automated
browser has no `window.ethereum`, so the connect modal has nothing to click and you only ever see
the welcome screen. This skill solves that with **csm-dev-wallet** — a dev wallet extension that
injects a provider and lets you connect as _any_ address or node operator without keys or signing
(the app runs on Hoodi testnet, where watch-only is enough to render every connected page).

## Prerequisites

- A target app must be reachable — the local dev server at `http://localhost:3000` (`yarn dev`), the
  CM instance (e.g. `localhost:3001`), or a remote testnet (`--url https://csm.testnet.fi`). This skill
  does **not** start anything — check first (`curl -sI <url>`), and ask the user to run `yarn dev` if local is down.
- Which **module** (CSM vs CM) and **chain** the target runs on are detected automatically from the app
  itself, so the same command works against any instance — no need to know or pass them.
- `csm-dev-wallet` is auto-installed into `.claude/skills/visual-verify/.cache/` on first run (it's a
  QA tool, deliberately kept out of the project's `package.json`). `playwright` is reused from the repo.

## Quickstart — screenshot any page in any state

```bash
# Dashboard, connected as node operator #4 (resolves the operator's manager address automatically)
node .claude/skills/visual-verify/scripts/verify.mjs --operator 4 --route /

# Settings, as operator #4's rewards address
node .claude/skills/visual-verify/scripts/verify.mjs --operator 4 --role rewards --route /settings

# Any route, connected as a raw address
node .claude/skills/visual-verify/scripts/verify.mjs --address 0xd8dA…96045 --route /keys

# A different instance — the CM-module app, or a remote testnet. Module + chain auto-detected from the URL.
node .claude/skills/visual-verify/scripts/verify.mjs --url http://localhost:3001 --operator 2
node .claude/skills/visual-verify/scripts/verify.mjs --url https://cm.testnet.fi --operator 5

# Dark mode, and a mobile-width layout (combine freely)
node .claude/skills/visual-verify/scripts/verify.mjs --operator 4 --theme dark
node .claude/skills/visual-verify/scripts/verify.mjs --operator 4 --viewport mobile --theme dark

# Just one element (cropped, scrolled into view) instead of the whole page
node .claude/skills/visual-verify/scripts/verify.mjs --operator 4 --selector '[data-testid="accountSectionHeader"]'

# The disconnected/welcome state — no wallet at all (operator/address not required)
node .claude/skills/visual-verify/scripts/verify.mjs --no-connect --route /

# Watch it happen live, and leave the browser open to poke around
node .claude/skills/visual-verify/scripts/verify.mjs --operator 12 --headed --keep-open
```

It prints the resulting `STATE` (url / connected / account / operator), confirms the requested operator
is the one actually shown, a **page-health** line (console errors, uncaught exceptions, failed + 4xx/5xx
requests), and a screenshot path — then **Read the PNG to actually look at it**. The health line is what
catches a page that _looks_ fine but is actually broken (e.g. a dev server serving 404 chunks). If a run
fails at any step, it still saves a `FAILED-*.png` of wherever it got stuck (and reports its path) — a
failure image usually shows the cause (a modal that never opened, a blank card, the wrong route).

**`--operator N` guarantees operator N is displayed.** Many operators share an address (e.g. one address
is the rewards address of operators 4, 36 and 318). Connecting only pins the _address_; the app then shows
a default operator (the first or last-cached), which may be a sibling, not N. So after connecting the
script switches the in-app operator selection to N and verifies it — if N isn't available for the resolved
address, it errors and lists what _is_ available. (`--address` has no specific operator, so no switch.)

Default output is `.cache/shots/<module>-<tag>.png` (prefixed with module + any theme/viewport variant
so they don't collide); override with `--out path.png` (relative paths resolve to cwd). Flags:
`--url <origin>` (default `$APP_ORIGIN` / `localhost:3000`) | `--operator N` | `--address 0x…` |
`--role manager|rewards|owner` (default `manager`) | `--route /path` | `--theme light|dark` |
`--viewport mobile|tablet|desktop|WxH` | `--selector <css>` (shoot one element) |
`--no-connect` (capture with no wallet; operator/address not required) | `--json` |
`--module csm|cm` | `--chain 560048` | `--headed` | `--keep-open` | `--full` (full-page) |
`--out file.png`. **`--module` and `--chain` are auto-detected from the target URL** — only pass them to override.

`--json` emits one structured object on **stdout** (progress logs go to stderr) with the connection
details, `state`, the screenshot path, and `health` + full `diagnostics` (the console/network errors).
Use it when an agent needs to act on the result — `health.total > 0` is the machine-readable "this page
has problems" signal even when the screenshot looks fine. On failure it prints `{ "ok": false, "error" }`
and exits non-zero.

`--theme` works via `prefers-color-scheme` (the app honours it), set before first paint and verified by
page-background luminance, with the header theme toggler as fallback — so it's reliable even at mobile
widths where the toggler hides in a menu. `--viewport` presets: mobile `390×844`, tablet `768×1024`,
desktop `1280×800` (or pass an explicit `WIDTHxHEIGHT`).

## Finding operators

To pick an operator — or find an address that controls several (needed to exercise the in-app
operator switcher, which changes operator _without_ a wallet change):

```bash
node .claude/skills/visual-verify/scripts/operators.mjs            # summary + multi-operator addresses
node .claude/skills/visual-verify/scripts/operators.mjs --id 4     # full details for operator #4
```

## How it connects (the non-obvious bits)

These quirks are already handled in `scripts/lib.mjs`; understand them before writing custom flows:

- **Connection is seeded, not clicked (with a modal fallback).** Setting `eth_accounts` alone does NOT
  auto-connect — wagmi/reef-knot only adopt a connection from persisted storage or an explicit connector
  call. So `connectAs` writes the exact 4 `localStorage` keys a real connect leaves behind (terms-accepted
  flag + `wagmi.recentConnectorId`/`reconnect-wallet-id` + the `wagmi.store` connection record) via
  `addInitScript` **before load**, and the app reconnects the injected wallet on boot — no clicks. If that
  reconnect doesn't take (e.g. wagmi bumps `wagmi.store`'s schema or the `reef-knot_accept-terms_n2`
  version suffix drifts), it falls back to the **proven modal flow**: `connectBtn` → tick the Terms
  checkbox (it gates the wallet buttons) → click the **"Browser"** option (the injected provider shows up
  under the pinned `browserExtension` connector, not by the wallet's own name).
- **The header chip re-renders asynchronously** after any navigation, reload, or account change (wagmi
  reconnects, balances fetch). Always wait for the header to settle into connected-or-disconnected
  before reading state or screenshotting, or you capture a blank chip. `settle()` does this.
- **Wallet account vs active operator are two layers.** One address can manage many operators; the app's
  switcher (`data-testid="nodeOperatorHeader"`) changes the active operator with no wallet event. The
  in-app operator selection is connection-scoped — it resets to the default operator on reconnect/reload,
  which is why `connectAs` re-asserts it (via `ensureOperator`) _after_ the final navigation, not before.

## Writing custom multi-step flows

For scenarios beyond a single screenshot (persistence checks, account switching, the operator switcher,
disconnect/reconnect), import the library instead of shelling out to the CLI:

```js
import { connectAs, ensureOperator, readState, settle, HOODI } from './lib.mjs';

const { context, wallet, page } = await connectAs({
  operatorId: 318,
  route: '/settings',
});
await wallet.switchAccount(page, '0xba99…26af'); // change wallet account → app reacts live
await settle(page);
await ensureOperator(page, 36); // switch in-app operator (no wallet change)
console.log(await readState(page)); // { url, connected, account, operator }
await page.screenshot({ path: 'after-switch.png' });
await context.close();
```

`connectAs(...)` returns Playwright's `context`/`page` plus the dev-wallet `wallet` controller, and (for
`operatorId`) guarantees that operator is active. Helpers: `ensureOperator(page, id)` (in-app switch +
verify), `currentOperatorId(page)`, `readState`, `settle`, `connectModal`. Key `wallet` methods:
`switchAccount(page, addr)`, `switchNetwork(page, chainId)`, `disconnect(page)`,
`selectOperator(page, id, role)`, `refreshOperators(page, chainId, module)`, `getOperator(page, id, …)`.
Full controller API, the underlying `wallet_test*` RPC primitives (for drivers that can't use the
helper), and a **dev-browser fallback** (for headed/persistent sessions) are in
[references/advanced.md](references/advanced.md).

## Key app facts

- Network: Hoodi testnet, `chainId 560048` (auto-detected per instance). The app's RPC proxy
  (`<origin>/api/rpc`) is reused to resolve operators.
- **CSM vs CM**: the app serves one module per instance (`MODULE` env). They have _different_ operator
  sets, so an id valid in CSM may not exist in CM. `operators.mjs --url <cm-origin>` lists the right set.
  The connect flow, header testids, and switcher are shared across both modules.
- Header testids: `accountSectionHeader` (wallet chip), `nodeOperatorHeader` (active operator + switcher),
  `connectBtn` (shown only when disconnected). Account modal: `disconnectBtn`, `connectedAddress`.
  Operator switcher rows: `switchModalOperatorRow`, with a "Switch" button per non-current row.
- Routes are normal Next.js paths: `/`, `/keys`, `/settings` (redirects to a sub-tab like
  `/settings/roles`), etc. Use whatever the app's nav exposes.
- `MODULE` (csm/cm) is set by the server env; pass `--module` to match if you've switched it.

## Troubleshooting

- **Welcome screen / never connects** → app likely on a different `MODULE` or chain than you passed,
  or the connect modal changed. Re-run with `--headed` to watch, and check the testids above still exist.
- **`ECONNREFUSED` / blank page** → dev server isn't running; start `yarn dev`.
- **Slow first load** → the dev server cold-compiles on first hit; navigation auto-retries (commit +
  app-shell wait, 3 attempts). If it still reports "never became ready", the server is stuck — restart `yarn dev`.
- **Operator resolve fails** → `/api/rpc` proxy unreachable or the id doesn't exist on this chain; try
  `operators.mjs` to list valid ids.
- **Chromium missing** → run `yarn playwright install chromium` (the repo's documented setup step).
