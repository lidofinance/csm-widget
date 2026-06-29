# Advanced: full wallet API, RPC primitives, and the dev-browser fallback

Read this when a single screenshot via `verify.mjs` isn't enough — e.g. you're scripting a stateful
scenario, driving the browser through a tool other than the bundled Playwright helper, or you need a
headed/persistent session.

## csm-dev-wallet — Playwright helper API

`import { launch } from 'csm-dev-wallet/playwright'` →
`const { context, wallet, extensionId } = await launch({ headless: true })`.

`wallet` (the `WalletController`):

| Method                                                               | Purpose                                                                                                                                                                                |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup({ origin, network, account?, signingMode?, … })`              | Pre-configure state via the service worker **before** navigating. Sets which account `eth_accounts` returns. Note: does NOT auto-connect the dApp — you still drive the connect modal. |
| `switchAccount(page, address, source?)`                              | Set active account; emits `accountsChanged` (app reacts live).                                                                                                                         |
| `switchNetwork(page, chainId)`                                       | Set active chain; emits `chainChanged`.                                                                                                                                                |
| `connect(page, address?, source?)`                                   | Wallet-side connect.                                                                                                                                                                   |
| `disconnect(page)`                                                   | Emits `accountsChanged([])`.                                                                                                                                                           |
| `selectOperator(page, operatorId, role, chainId?, module?)`          | Resolve an operator's role address from cache, set it active.                                                                                                                          |
| `refreshOperators(page, chainId?, module?, rpcUrl?)`                 | Fetch live operators from RPC, cache, return them.                                                                                                                                     |
| `getOperators(page, chainId?, module?)` / `getOperator(page, id, …)` | Read cached operators.                                                                                                                                                                 |
| `seedOperators(page, ops, chainId, module?)`                         | Inject operators into cache.                                                                                                                                                           |
| `setRpcUrl(page, chainId, url)`                                      | Point the wallet at an RPC (we use the app's `/api/rpc`).                                                                                                                              |
| `setSigningMode(page, 'approve'\|'reject'\|'error'\|'prompt')`       | How signing requests behave (only matters for tx flows; visual checks don't need it).                                                                                                  |

`SetupOptions` of note: `account` (auto-return this address), `network` (defaults 1 — pass 560048 for Hoodi),
`moduleAvailability: { csm, cm }`, `operators` (seed), `signingMode`. On Hoodi/Mainnet the wallet is
watch-only (can't sign); on an Anvil fork it can impersonate for real transactions.

## Driver-agnostic "set account" RPC primitives

Any driver that can run JS on the page (Playwright MCP, chrome-devtools, dev-browser, agent-browser)
can control the wallet directly through these custom methods on `window.ethereum`, once the extension
is loaded — no helper required:

```js
await window.ethereum.request({
  method: 'wallet_testSetNetwork',
  params: [{ chainId: 560048 }],
});
await window.ethereum.request({
  method: 'wallet_testSetAccount',
  params: [{ address: '0x…', source: { type: 'manual' } }],
});
// also: wallet_testConnect, wallet_testDisconnect, wallet_testGetState, wallet_testSetSigningMode,
// wallet_testRefreshOperators, wallet_testGetOperators, wallet_testSetOperatorAccount, wallet_testSetRpcUrl
```

`wallet_testSetAccount` emits `accountsChanged`, so the app updates live. Check the provider is present
with `window.ethereum?.isCSMDevWallet === true`.

## Connect flow (any driver)

1. Navigate to `http://localhost:3000`.
2. (optional) set account via the RPC above.
3. Click `[data-testid="connectBtn"]`.
4. Tick the Terms/Privacy checkbox (`role=checkbox`; use a forced click — a styled SVG overlays it).
5. Click the wallet option labelled **"Browser"** (NOT MetaMask/OKX/Ledger/Coinbase/WalletConnect).
6. Wait for `[data-testid="accountSectionHeader"]`. Disconnect = click that chip → `[data-testid="disconnectBtn"]`.

## Driver verdicts (tested)

- **Playwright helper (bundled here)** — best: headless, no display/GL flags. Use by default.
- **dev-browser** — works, but only via CDP attach to an externally launched, extension-loaded,
  **headed + software-GL** Chrome kept alive as a background task (see below).
- **agent-browser** — can load the extension + inject the provider, but headless screenshots deadlock
  while an extension is loaded; would need the same headed + swiftshader setup as dev-browser.
- **chrome-devtools-mcp** — cannot: its managed Chrome runs `--disable-extensions` and can't be
  reconfigured mid-session or attached to an external CDP browser, so there's no `window.ethereum`.

## dev-browser fallback (headed / persistent session)

When you want a persistent, watch-it-live session instead of the headless helper:

1. Launch external Chrome as a **background task** (plain `&`/`nohup` get reaped on macOS), headed, with
   software GL (the dev page's continuous animation starves the default compositor → screenshots hang):
   ```bash
   "<Chrome for Testing>" --use-angle=swiftshader --use-gl=angle --window-size=1366,900 \
     --remote-debugging-port=9323 --user-data-dir=/tmp/devbrowser-prof --no-first-run \
     --disable-extensions-except="<EXT>" --load-extension="<EXT>" http://localhost:3000
   ```
   where `<EXT>` = `.claude/skills/visual-verify/.cache/dist/extension`
   and `<Chrome for Testing>` is Playwright's chromium (find via
   `node -e "console.log(require('playwright').chromium.executablePath())"`).
2. Drive it: `dev-browser --connect http://localhost:9323` (QuickJS; `browser.getPage(...)` → a Playwright
   `Page`). Set the account via the `wallet_test*` RPC, then run the connect flow above with forced clicks.
   Use `--timeout 60`+ for multi-action scripts; `saveScreenshot` writes to `~/.dev-browser/tmp/` (copy out).

## Example: a full stateful scenario

A 10-step scenario (connect → reload-persists → switch operator → settings → reload → change wallet →
in-app operator switch → disconnect/reconnect) was validated on both the Playwright helper and dev-browser
with identical results. Build such flows with `connectAs()` + `wallet.switchAccount()` +
`page.getByTestId('nodeOperatorHeader').click()` then the row's "Switch" button. Key learned behaviours:
connection and route both persist across reload; account changes update the page in-place (no redirect);
the in-app operator switch needs no wallet event; reconnect resets the active operator to the default.
