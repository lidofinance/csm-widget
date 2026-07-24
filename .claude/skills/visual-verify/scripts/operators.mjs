#!/usr/bin/env node
// List live operators on the running app's chain via the dev wallet, and surface
// addresses that control multiple operators (useful for testing the in-app operator
// switcher, which lets one address switch operators without a wallet change).
//
// Examples:
//   node scripts/operators.mjs                       # local app: summary + multi-operator addresses
//   node scripts/operators.mjs --url http://localhost:3001   # the CM instance (different operator set)
//   node scripts/operators.mjs --id 4                # details for operator #4
//   node scripts/operators.mjs --multi               # only addresses controlling >1 operator
// module (csm/cm) and chain are auto-detected from --url unless overridden.
import { loadDevWallet, detectAppConfig, ORIGIN, log } from './lib.mjs';

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i === -1 ? d : argv[i + 1]; };

const main = async () => {
  const origin = flag('url') || flag('origin') || ORIGIN;
  const detected = await detectAppConfig(origin);
  const chainId = flag('chain') ? Number(flag('chain')) : detected.chainId;
  const module = flag('module') || detected.module;
  log(`target ${origin} — module=${module} chain=${chainId}`);
  const { launch } = await loadDevWallet();
  const { context, wallet } = await launch({ headless: true });
  await wallet.setup({ origin, network: chainId });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wallet.setRpcUrl(page, chainId, `${origin}/api/rpc`).catch(() => {});

  const id = flag('id');
  if (id != null) {
    await wallet.refreshOperators(page, chainId, module).catch(() => {});
    const op = await wallet.getOperator(page, String(id), chainId, module);
    log(`operator #${id}:`, JSON.stringify(op, null, 2));
    await context.close();
    return;
  }

  const ops = await wallet.refreshOperators(page, chainId, module);
  log(`total operators on chain ${chainId} (${module}): ${ops.length}`);
  const byAddr = {};
  for (const o of ops) {
    for (const a of [o.managerAddress, o.rewardsAddress]) {
      if (!a) continue;
      (byAddr[a.toLowerCase()] ||= new Set()).add(String(o.id));
    }
  }
  const multi = Object.entries(byAddr)
    .map(([addr, set]) => ({ addr, ops: [...set] }))
    .filter((x) => x.ops.length > 1)
    .sort((a, b) => b.ops.length - a.ops.length);
  log('addresses controlling multiple operators (top 10):');
  for (const m of multi.slice(0, 10)) log(`  ${m.addr}  ->  #${m.ops.join(', #')}`);
  if (!flag('multi')) {
    log('first 6 operators:');
    for (const o of ops.slice(0, 6)) log(`  #${o.id}  manager=${o.managerAddress}`);
  }
  await context.close();
};

main().catch((e) => { console.error('[visual-verify] FAILED:', e.message); process.exit(1); });
