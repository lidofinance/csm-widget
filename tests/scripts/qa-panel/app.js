const $ = (id) => document.getElementById(id);
const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (ch) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[ch],
  );
const short = (hex, n = 6) =>
  hex ? `${hex.slice(0, n + 2)}…${hex.slice(-n)}` : '—';
const ago = (time) => {
  const s = Math.max(
    0,
    Math.round((Date.now() - new Date(time).getTime()) / 1000),
  );
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
const store = {
  get: (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

const VIEWS = ['setup', 'operator', 'commands', 'presets'];
// a fork's snapshots and operators exist on that network only
const chain = store.get('qa.chain', 'hoodi');
const chainKey = (key) => `${key}.${chain}`;
const state = {
  meta: null,
  live: null,
  module: store.get('qa.module', null),
  operator: null,
  presets: null,
  filter: 'all',
  selected: new Set(),
  open: store.get('qa.open', null),
  collapsed: new Set(store.get('qa.collapsed', [])),
  snapshots: store.get(chainKey('qa.snapshots'), []),
  secrets: new Map(),
  logCleared: 0,
};

const api = async (path, body) => {
  const url = new URL(path, location.origin);
  url.searchParams.set('chain', chain);
  const response = await fetch(
    url,
    body === undefined
      ? undefined
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? response.statusText);
  return data;
};

const toast = (text, isError = false) => {
  const el = document.createElement('div');
  el.className = `toast${isError ? ' err' : ''}`;
  el.textContent = text;
  $('toasts').append(el);
  setTimeout(() => el.remove(), isError ? 6000 : 3000);
};

const copy = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    toast(`copied ${label ?? short(text, 14)}`);
  } catch {
    toast('could not copy', true);
  }
};

/* ---------- views ---------- */

const showView = (view) => {
  if (!VIEWS.includes(view)) view = 'setup';
  for (const panel of document.querySelectorAll('[data-panel]'))
    panel.hidden = panel.dataset.panel !== view;
  for (const link of document.querySelectorAll('[data-view]'))
    link.classList.toggle('on', link.dataset.view === view);
  if (location.hash !== `#/${view}`)
    history.replaceState(null, '', `#/${view}`);
};
const viewFromHash = () => location.hash.replace(/^#\/?/, '');
window.addEventListener('hashchange', () => showView(viewFromHash()));

const setBadge = (id, text, kind) => {
  $(id).hidden = !text;
  $(id).textContent = text ?? '';
  $(id).className = `badge ${kind ?? ''}`;
};

/* ---------- live state ---------- */

const renderState = (s) => {
  const previous = state.live;
  state.live = s;
  $('aliveDot').className = `dot${s.forkAlive ? '' : ' off'}`;
  $('alivePill').textContent = s.forkAlive
    ? `fork ${s.chain} · live`
    : `fork ${s.chain} is down`;
  $('chainName').textContent = s.chain;
  $('statBlock').textContent = s.block
    ? Number(s.block).toLocaleString('en-US')
    : '—';
  $('statRpc').textContent = s.forkStartedAt
    ? `block · started ${ago(s.forkStartedAt)}`
    : 'fork block';
  $('statMocked').textContent = s.clMocked;
  $('statUpstream').textContent = `real CL ${s.clUpstream ? 'on' : 'off'}`;
  const setCfg = (id, value, fallback) => {
    $(id).textContent = value ?? fallback;
    $(id).classList.toggle('none', !value);
    $(id).dataset.value = value ?? '';
  };
  setCfg('cfgRpc', s.rpcTunnel, 'no tunnel: start it below');
  setCfg('cfgCl', s.clUrl);
  setCfg('cfgIpfs', s.ipfsTunnel, 'no tunnel: start it below');

  // a restarted fork drops its snapshots and the presets' operators
  if (
    previous?.forkStartedAt &&
    s.forkStartedAt &&
    previous.forkStartedAt !== s.forkStartedAt
  ) {
    state.snapshots = [];
    store.set(chainKey('qa.snapshots'), []);
    renderSnapshot();
    loadPresets();
    toast('fork restarted: snapshots dropped');
  }
  renderDocker();
  renderWarm();
  renderRunning(s.running);
};

const pollState = async () => {
  try {
    renderState(await api('/api/state'));
  } catch {
    $('aliveDot').className = 'dot off';
    $('alivePill').textContent = 'panel is not responding';
  }
};

const renderChains = () => {
  $('chains').innerHTML = state.meta.chains
    .map(
      (c) =>
        `<button data-chain="${esc(c)}" class="${c === chain ? 'on' : ''}">${esc(c)}</button>`,
    )
    .join('');
};

const renderModules = () => {
  $('modules').innerHTML = state.meta.modules
    .map(
      (m) =>
        `<button data-module="${esc(m)}" class="${m === state.module ? 'on' : ''}">${esc(m)}</button>`,
    )
    .join('');
};

/* ---------- jobs ---------- */

const resultText = (result) =>
  result === undefined || result === null
    ? ''
    : typeof result === 'string'
      ? result
      : JSON.stringify(result, null, 2);

const entryHtml = (run, live = false) => `
  <div class="entry">
    <div class="cmdline"><span class="p">$</span>${esc(run.line)}${live ? '' : `<span class="t">${new Date(run.at).toLocaleTimeString('en-GB')}</span>`}</div>
    ${run.log.map((l) => `<div class="step" style="padding-left:${16 + l.depth * 16}px">${l.depth ? '└ ' : '› '}${esc(l.text)}</div>`).join('')}
    ${
      live
        ? '<div><span class="spin"></span><span class="c">running…</span></div>'
        : run.ok
          ? `<div class="ok">✓ done in ${(run.ms / 1000).toFixed(1)}s</div>${resultText(run.result) ? `<div class="res">${esc(resultText(run.result))}</div>` : ''}`
          : `<div class="err">✗ ${esc(run.error)}</div>`
    }
  </div>`;

let runs = [];
let running = null;
const renderLog = () => {
  const done = runs.filter((run) => run.at > state.logCleared);
  const html =
    (running ? entryHtml(running, true) : '') +
    done.map((run) => entryHtml(run)).join('');
  $('log').innerHTML =
    html || '<div class="c"># command output shows up here</div>';
};
const renderRunning = (run) => {
  if (run?.at === running?.at && run?.log.length === running?.log.length)
    return;
  running = run;
  renderLog();
};
const loadHistory = async () => {
  runs = await api('/api/history');
  renderLog();
};

// every long action goes through here, so the log follows it live
const job = async (path, body, { quiet = false, label } = {}) => {
  const poll = setInterval(pollState, 700);
  try {
    const result = await api(path, body);
    running = null;
    await loadHistory();
    if (!quiet)
      result.ok
        ? toast(`✓ ${label}`)
        : toast(`✗ ${label}: ${result.error}`, true);
    if (result.ok && state.operator)
      await loadOperator(state.operator.id, { keepSelection: true });
    return result;
  } catch (error) {
    toast(error.message, true);
    return { ok: false };
  } finally {
    clearInterval(poll);
    pollState();
  }
};
const run = (command, args = [], options) =>
  job(
    '/api/run',
    { module: state.module, command, args },
    { label: command, ...options },
  );

/* ---------- docker ---------- */

const nodeBadge = (node) => {
  if (!node) return '<span class="badge idle">not created</span>';
  if (node.status !== 'running')
    return `<span class="badge err">${esc(node.status)}</span>`;
  if (node.health === 'healthy') return '<span class="badge ok">healthy</span>';
  if (node.health) return `<span class="badge warn">${esc(node.health)}</span>`;
  return '<span class="badge ok">running</span>';
};

const renderDocker = () => {
  const docker = state.live?.docker;
  if (!docker) return;
  if (!docker.available) {
    $('docker').innerHTML =
      '<div class="empty">docker is not running<br />start Docker Desktop</div>';
    $('nonceBanner').innerHTML = '';
    return;
  }
  const tunnelUrl = state.live.tunnelUrl;
  $('docker').innerHTML = docker.profiles
    // the other network's fork has a panel of its own: switch to it
    .filter(
      (p) => !state.meta.chains.includes(p.profile) || p.profile === chain,
    )
    .map((p) => {
      const up = p.node?.status === 'running';
      const isFork = p.profile === 'hoodi' || p.profile === 'mainnet';
      const isTunnel = p.profile === 'tunnel';
      const path = state.meta.tunnelPaths[p.profile];
      // what goes into /qa-config: the tunnel itself, or a service behind it
      const url = isTunnel ? tunnelUrl : tunnelUrl && `${tunnelUrl}${path}`;
      const missing = isTunnel ? 'waiting for the URL…' : 'no tunnel: start it';
      return `
      <div class="svc">
        <div class="svc-head">
          <span class="svc-name">${esc(p.profile)}</span>
          ${nodeBadge(p.node)}
          ${up ? `<span class="c mono" style="font-size: 12px">started ${ago(p.node.startedAt)}</span>` : ''}
        </div>
        ${
          up
            ? `
          <div class="svc-url">
            <span class="c">${isTunnel ? 'url' : 'public'}</span>
            <span class="val ${url ? '' : 'none'}">${url ? esc(url) : missing}</span>
            <button class="copy" data-text="${esc(url ?? '')}" ${url ? '' : 'disabled'}>copy</button>
          </div>`
            : ''
        }
        <div class="svc-actions">
          ${
            up
              ? `<button class="btn sm" data-docker="restart" data-profile="${esc(p.profile)}">${isFork ? 'restart fork' : isTunnel ? 'new URL' : 'restart'}</button>
               <button class="btn sm danger" data-docker="stop" data-profile="${esc(p.profile)}">stop</button>`
              : `<button class="btn sm primary" data-docker="up" data-profile="${esc(p.profile)}">› start</button>`
          }
        </div>
      </div>`;
    })
    .join('');

  const started = state.live.forkStartedAt;
  const showNonce =
    started && store.get(chainKey('qa.nonceAck'), null) !== started;
  $('nonceBanner').innerHTML = showNonce
    ? `
    <div class="banner">
      <span class="grow"><b>fork started ${ago(started)}.</b> If your wallet sent transactions to an earlier fork, new ones will hang:
      MetaMask → Settings → Developer tools → Clear activity and nonce data</span>
      <button class="copy" id="nonceAck">got it</button>
    </div>`
    : '';
};

const CONFIRM = {
  restart: (p) =>
    p === 'tunnel'
      ? 'Get a new tunnel URL? Every public URL changes: update /qa-config and the wallet network'
      : p === 'hoodi' || p === 'mainnet'
        ? `Restart the ${p} fork? It resets to the live chain: operators, keys and snapshots made on it are gone, and the wallet nonce has to be reset. The tunnel URL stays`
        : `Restart ${p}?`,
  stop: (p) =>
    p === 'tunnel'
      ? 'Stop the tunnel? The deployed widget loses every local service'
      : `Stop ${p}?`,
};

$('docker').addEventListener('click', async (event) => {
  const el = event.target.closest('[data-docker]');
  if (!el) return;
  const { docker: action, profile } = el.dataset;
  if (CONFIRM[action] && !confirm(CONFIRM[action](profile))) return;
  await job(
    '/api/docker',
    { profile, action },
    { label: `${action} ${profile}` },
  );
});
$('nonceBanner').addEventListener('click', (event) => {
  if (event.target.id !== 'nonceAck') return;
  store.set(chainKey('qa.nonceAck'), state.live.forkStartedAt);
  renderDocker();
});

/* ---------- warm-up ---------- */

const renderWarm = () => {
  const { warm, forkStartedAt, forkAlive } = state.live;
  let dot = 'idle';
  let title = 'never warmed up';
  let sub = 'run it before opening the widget';
  let badge = ['cold', 'idle'];
  if (!forkAlive) {
    dot = 'off';
    title = 'fork is down';
    sub = 'start it in docker';
    badge = ['down', 'err'];
  } else if (warm?.current) {
    dot = '';
    title = `warm · ${ago(warm.at)}`;
    sub = `${short(warm.address, 4)} · ${warm.module} · took ${(warm.ms / 1000).toFixed(1)}s`;
    badge = ['warm', 'ok'];
  } else if (warm) {
    dot = 'warn';
    title = 'cold: the fork restarted after the last warm-up';
    sub = `fork started ${ago(forkStartedAt)}, warmed ${ago(warm.at)}`;
    badge = ['cold', 'warn'];
  }
  $('warmState').innerHTML =
    `<span class="dot ${dot}"></span><span>${esc(title)}<small>${esc(sub)}</small></span>`;
  setBadge('navSetup', ...badge);
  if (!$('warmAddress').value && warm?.address)
    $('warmAddress').value = warm.address;
};

const renderKnownAddresses = () => {
  const known = new Map();
  for (const p of state.presets?.presets ?? [])
    known.set(p.address, `preset ${p.module} ${p.name}`);
  if (state.operator) {
    known.set(state.operator.info.manager, `#${state.operator.id} manager`);
    known.set(state.operator.info.reward, `#${state.operator.id} reward`);
  }
  $('knownAddresses').innerHTML = [...known]
    .map(
      ([address, label]) => `<option value="${address}">${esc(label)}</option>`,
    )
    .join('');
};

$('warmForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const address = $('warmAddress').value.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address))
    return toast('enter a wallet address', true);
  await job(
    '/api/warmup',
    { module: state.module, address },
    { label: 'warm-up' },
  );
});

/* ---------- presets ---------- */

const loadPresets = async () => {
  try {
    state.presets = await api('/api/presets');
    renderPresets();
    renderKnownAddresses();
  } catch (error) {
    $('presets').innerHTML = `<div class="empty">${esc(error.message)}</div>`;
  }
};

const renderPresets = () => {
  const { file, exists } = state.presets;
  const presets = state.presets.presets.filter(
    (p) => p.module === state.module,
  );
  $('presetsFile').textContent = file.split('/').pop();
  $('presetsDelete').disabled = !exists;
  const stale = presets.filter((p) => p.onFork === false);
  setBadge(
    'navPresets',
    !exists
      ? 'none'
      : stale.length
        ? `${stale.length} stale`
        : `${presets.length}`,
    !exists || !presets.length ? 'idle' : stale.length ? 'err' : 'ok',
  );
  if (!exists) {
    $('presets').innerHTML =
      '<div class="empty">no presets file<br />the next e2e run generates it in globalSetup</div>';
    return;
  }
  if (!presets.length) {
    const others = [...new Set(state.presets.presets.map((p) => p.module))];
    $('presets').innerHTML =
      `<div class="empty">no ${esc(state.module)} presets in the file${others.length ? `<br />it has ${esc(others.join(', '))}: switch the module in the sidebar` : ''}<br />the ${esc(state.module)} e2e run generates them</div>`;
    return;
  }
  $('presets').innerHTML = `
    ${
      stale.length
        ? `<div class="banner err"><span class="grow"><b>${stale.length} preset(s) are stale:</b> their operators are not on this fork, it was restarted.
      Delete the file and the next e2e run rebuilds the presets</span></div>`
        : ''
    }
    <div class="scroll"><table>
      <thead><tr><th>module</th><th>preset</th><th>address</th><th>operator</th><th>setup</th><th>mnemonic</th><th>on fork</th></tr></thead>
      <tbody>
        ${presets
          .map((p) => {
            const key = `${p.module}.${p.name}`;
            const secret = state.secrets.get(key);
            return `<tr>
            <td class="c">${esc(p.module)}</td>
            <td>${esc(p.name)}</td>
            <td><span class="pk">${short(p.address, 4)}<button class="copy" data-text="${esc(p.address)}">copy</button></span></td>
            <td>${p.noId === undefined ? '<span class="c">—</span>' : `<button class="nolink" data-open="${esc(p.noId)}" data-module="${esc(p.module)}">#${p.noId}</button>`}</td>
            <td><span class="tags">${p.state.map((s) => `<span class="tag">${esc(s.replace(/^with(?=[A-Z])/, ''))}</span>`).join('') || '<span class="c">—</span>'}</span></td>
            <td><span class="secret"><span>${secret ? esc(secret) : '•••• •••• •••• ••••'}</span>
              <button class="copy" data-reveal="${esc(key)}">${secret ? 'hide' : 'show'}</button>
              <button class="copy" data-secret="${esc(key)}">copy</button></span></td>
            <td>${p.onFork === null ? '<span class="c">—</span>' : p.onFork ? '<span class="stage dep">yes</span>' : '<span class="stage bad">stale</span>'}</td>
          </tr>`;
          })
          .join('')}
      </tbody>
    </table></div>`;
};

// the mnemonics stay on the server until asked for
const readSecret = async (key) => {
  const [module, ...name] = key.split('.');
  try {
    return (
      await api('/api/presets/secret', { module, preset: name.join('.') })
    ).secretPhrase;
  } catch (error) {
    toast(error.message, true);
    return undefined;
  }
};

$('presets').addEventListener('click', async (event) => {
  const el = event.target.closest('button');
  if (!el) return;
  if (el.dataset.reveal) {
    const key = el.dataset.reveal;
    if (state.secrets.has(key)) state.secrets.delete(key);
    else {
      const secret = await readSecret(key);
      if (secret) state.secrets.set(key, secret);
    }
    renderPresets();
  }
  if (el.dataset.secret) {
    const secret = await readSecret(el.dataset.secret);
    if (secret) copy(secret, 'mnemonic');
  }
  if (el.dataset.open) {
    if (state.meta.modules.includes(el.dataset.module))
      setModule(el.dataset.module);
    $('noId').value = el.dataset.open;
    loadOperator(el.dataset.open);
    showView('operator');
  }
});
$('presetsReload').addEventListener('click', loadPresets);
$('presetsDelete').addEventListener('click', async () => {
  if (
    !confirm(
      'Delete the presets file? The next e2e run rebuilds the presets on the fork',
    )
  )
    return;
  try {
    await api('/api/presets/delete', {});
    toast('presets file deleted');
  } catch (error) {
    toast(error.message, true);
  }
  loadPresets();
});

/* ---------- snapshots ---------- */

const renderSnapshot = () => {
  const last = state.snapshots.at(-1);
  $('statSnapshot').textContent = last ? last.id : '—';
  $('revertLink').disabled = !last;
};
const takeSnapshot = async () => {
  const result = await run('snapshot', [], { quiet: true });
  if (!result.ok) return;
  state.snapshots.push({ id: result.result, at: Date.now() });
  store.set(chainKey('qa.snapshots'), state.snapshots);
  renderSnapshot();
  toast(`snapshot ${result.result}`);
};
const revertSnapshot = async () => {
  const last = state.snapshots.at(-1);
  if (
    !last ||
    !confirm(
      `Revert the fork to snapshot ${last.id}? Everything done since is lost`,
    )
  )
    return;
  const result = await run('revert', [last.id], { quiet: true });
  // anvil drops the snapshot it reverts to
  state.snapshots.pop();
  store.set(chainKey('qa.snapshots'), state.snapshots);
  renderSnapshot();
  if (result.ok) toast(`reverted to ${last.id}`);
};

/* ---------- operator ---------- */

const filters = {
  all: { label: 'all', test: () => true },
  deposited: { label: 'deposited', test: (k) => k.deposited },
  mocked: { label: 'mocked', test: (k) => k.cl },
  pending: { label: 'not deposited', test: (k) => !k.deposited },
};

const loadOperator = async (id, { keepSelection = false } = {}) => {
  try {
    const op = await api(
      `/api/operator?module=${encodeURIComponent(state.module)}&id=${encodeURIComponent(id)}`,
    );
    state.operator = op;
    if (!keepSelection) state.selected.clear();
    store.set(chainKey('qa.noId'), id);
    renderOperator();
    renderCommands();
    renderKnownAddresses();
  } catch (error) {
    toast(error.message, true);
  }
};

const stage = (k) =>
  k.deposited
    ? '<span class="stage dep">deposited</span>'
    : k.vetted
      ? '<span class="stage vet">queued</span>'
      : '<span class="stage new">not vetted</span>';

const clSelect = (k) => `
  <select class="cl${k.cl ? ' set' : ''}" data-pubkey="${esc(k.pubkey)}" ${k.deposited ? '' : 'disabled title="CL only affects deposited keys"'}>
    <option value="">${k.deposited ? '— real CL —' : '— deposit first —'}</option>
    ${state.meta.statuses.map((s) => `<option value="${s}" ${s === k.cl ? 'selected' : ''}>${s}</option>`).join('')}
  </select>`;

const renderOperator = () => {
  const op = state.operator;
  const { info } = op;
  const keys = op.keys.filter(filters[state.filter].test);
  const allSelected =
    keys.length > 0 && keys.every((k) => state.selected.has(k.pubkey));
  const selected = op.keys.filter((k) => state.selected.has(k.pubkey));
  const selectedDeposited = selected.filter((k) => k.deposited);

  $('operatorTitle').textContent = `Operator #${op.id}`;
  $('operatorActions').hidden = false;
  if (document.activeElement !== $('depositCount'))
    $('depositCount').value = Math.max(info.depositable, 1);
  setBadge('navOperator', `#${op.id}`, 'plain idle');
  $('operatorSummary').innerHTML = `
    <div class="chips">
      <span class="chip">${esc(op.module)}</span>
      <span class="chip">added <b>${info.added}</b></span>
      <span class="chip">vetted <b>${info.vetted}</b></span>
      <span class="chip">deposited <b>${info.deposited}</b></span>
      <span class="chip">depositable <b>${info.depositable}</b></span>
      <span class="chip">exited <b>${info.exited}</b></span>
      <span class="chip">withdrawn <b>${info.withdrawn}</b></span>
    </div>
    <div class="roles">
      <span class="k">manager</span><span>${esc(info.manager)}</span><button class="copy" data-text="${esc(info.manager)}">copy</button>
      <span class="k">reward</span><span>${esc(info.reward)}</span><button class="copy" data-text="${esc(info.reward)}">copy</button>
    </div>`;

  $('operator').innerHTML = `
    <div class="toolbar">
      <div class="tabs">
        ${Object.entries(filters)
          .map(
            ([key, f]) =>
              `<button class="tab ${key === state.filter ? 'on' : ''}" data-filter="${esc(key)}">${f.label}<span>${op.keys.filter(f.test).length}</span></button>`,
          )
          .join('')}
      </div>
    </div>

    ${
      selected.length
        ? `
      <div class="bulk">
        <span>${selected.length} selected${selectedDeposited.length < selected.length ? ` · ${selectedDeposited.length} deposited` : ''}</span>
        <span class="grow"></span>
        <select class="cl" id="bulkStatus">${state.meta.statuses.map((s) => `<option>${s}</option>`).join('')}</select>
        <button class="btn sm primary" data-bulk="set" ${selectedDeposited.length ? '' : 'disabled'}>apply</button>
        <button class="btn sm" data-bulk="clear">clear mock</button>
        <button class="btn sm" data-bulk="none">cancel</button>
      </div>`
        : ''
    }

    ${
      keys.length
        ? `
      <div class="scroll keys-scroll"><table>
        <thead><tr>
          <th style="width: 28px"><input type="checkbox" id="selectAll" ${allSelected ? 'checked' : ''} /></th>
          <th>#</th><th>pubkey</th><th>contract</th><th>CL status</th>
        </tr></thead>
        <tbody>
          ${keys
            .map(
              (k) => `
            <tr class="${state.selected.has(k.pubkey) ? 'sel' : ''}">
              <td><input type="checkbox" data-select="${esc(k.pubkey)}" ${state.selected.has(k.pubkey) ? 'checked' : ''} /></td>
              <td class="c">${k.index}</td>
              <td><span class="pk">${short(k.pubkey)}<button class="copy" data-text="${esc(k.pubkey)}">copy</button></span></td>
              <td>${stage(k)}</td>
              <td>${clSelect(k)}</td>
            </tr>`,
            )
            .join('')}
        </tbody>
      </table></div>`
        : '<div class="empty">no keys in this filter</div>'
    }

    <div class="hint" id="reloadHint"><b>↻</b> reload the widget page: the SDK caches CL responses</div>`;
};

const setCl = async (pubkeys, status) => {
  try {
    await api('/api/cl', { pubkeys, status });
    for (const key of state.operator.keys)
      if (pubkeys.includes(key.pubkey)) key.cl = status;
    renderOperator();
    $('reloadHint').classList.add('show');
    pollState();
    toast(
      status
        ? `${pubkeys.length} key(s) → ${status}`
        : `mock cleared on ${pubkeys.length} key(s)`,
    );
  } catch (error) {
    toast(error.message, true);
  }
};

$('lookup').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = $('noId').value.trim();
  if (id) loadOperator(id);
});

$('operator').addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('select.cl[data-pubkey]'))
    setCl([el.dataset.pubkey], el.value || null);
  if (el.matches('[data-select]')) {
    el.checked
      ? state.selected.add(el.dataset.select)
      : state.selected.delete(el.dataset.select);
    renderOperator();
  }
  if (el.id === 'selectAll') {
    const keys = state.operator.keys.filter(filters[state.filter].test);
    for (const k of keys)
      el.checked
        ? state.selected.add(k.pubkey)
        : state.selected.delete(k.pubkey);
    renderOperator();
  }
});

$('operatorCard').addEventListener('click', (event) => {
  const el = event.target.closest('button');
  if (!el) return;
  if (el.dataset.filter) {
    state.filter = el.dataset.filter;
    renderOperator();
  }
  if (el.dataset.quick === 'reload')
    loadOperator(state.operator.id, { keepSelection: true });
  if (el.dataset.quick === 'addKeys')
    run('addKeys', [String(state.operator.id), $('addCount').value]);
  if (el.dataset.quick === 'depositKeys')
    run('depositKeys', [$('depositCount').value]);
  if (el.dataset.bulk === 'none') {
    state.selected.clear();
    renderOperator();
  }
  if (el.dataset.bulk === 'set') {
    const pubkeys = state.operator.keys
      .filter((k) => k.deposited && state.selected.has(k.pubkey))
      .map((k) => k.pubkey);
    setCl(pubkeys, $('bulkStatus').value);
  }
  if (el.dataset.bulk === 'clear') setCl([...state.selected], null);
});

/* ---------- commands ---------- */

// `<noId> [keysCount]`, `<address...>`, `<REACHED|EXHAUSTED>`, `[[treeAddresses]]`
const parseArgs = (spec) =>
  (spec.match(/<[^>]*>|\[(?:[^[\]]|\[[^\]]*\])*\]/g) ?? []).map((token) => {
    const optional = token.startsWith('[');
    let name = token.slice(1, -1);
    const variadic = name.endsWith('...');
    name = name.replace('...', '');
    const options = /^[A-Za-z_]+(\|[A-Za-z_]+)+$/.test(name)
      ? name.split('|')
      : null;
    const json = /^[[{]/.test(name) || name.includes('[');
    return { name, optional, variadic, options, json };
  });

const allCommands = () => state.meta.categories.flatMap((c) => c.commands);

// ICS and IDVTC are vetted gates: no curated operators through them
const VETTED_GATES = ['ics', 'idvtc'];

// arguments whose values the panel knows: gates of the module, roles
const choicesFor = (cmd, arg) => {
  if (arg.name === 'role') {
    return {
      options: state.meta.roles.map((r) => ({
        value: r.name,
        label: `${r.name} · ${r.contract}`,
        title: r.about,
      })),
    };
  }
  if (!arg.name.startsWith('selector')) return null;
  const gates = state.meta.gates[state.module] ?? [];
  const usable =
    cmd === 'createCuratedOperator'
      ? gates.filter((g) => !VETTED_GATES.includes(g))
      : gates;
  return { gates: usable, multiple: arg.name.includes('[selectors]') };
};

const fieldFor = (cmd, arg, i) => {
  const id = `arg-${cmd}-${i}`;
  const op = state.operator;
  const prefill = op && arg.name === 'noId' ? op.id : '';
  const choices = choicesFor(cmd, arg);
  const name = choices?.gates
    ? choices.multiple
      ? 'gates'
      : 'gate'
    : arg.name;
  const hint = choices?.multiple
    ? ' <em>pick one or more</em>'
    : arg.variadic
      ? ' <em>space-separated</em>'
      : '';
  const label = `<label for="${id}">${esc(name)}${arg.optional ? ' <em>optional</em>' : ''}${hint}</label>`;
  if (choices?.gates && !choices.gates.length) {
    return `<div class="arg">${label}<div class="c mono" style="font-size: 13px">no gates in ${esc(state.module)} on this chain</div></div>`;
  }
  if (choices?.gates && choices.multiple) {
    return `<div class="arg">${label}<div class="pick" id="${id}">${choices.gates
      .map(
        (g, n) =>
          `<label class="pick-item"><input type="checkbox" value="${esc(g)}" ${n === 0 ? 'checked' : ''} /><span>${esc(g)}</span></label>`,
      )
      .join('')}</div></div>`;
  }
  if (choices?.gates) {
    return `<div class="arg">${label}<select class="field" id="${id}">${choices.gates.map((g) => `<option>${esc(g)}</option>`).join('')}</select></div>`;
  }
  if (choices?.options) {
    return `<div class="arg">${label}<select class="field" id="${id}">${choices.options
      .map(
        (o) =>
          `<option value="${esc(o.value)}" title="${esc(o.title)}">${esc(o.label)}</option>`,
      )
      .join('')}</select><div class="arg-note" id="${id}-note"></div></div>`;
  }
  if (arg.options) {
    return `<div class="arg">${label}<select class="field" id="${id}">${arg.options.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>`;
  }
  if (arg.json) {
    return `<div class="arg">${label}<textarea class="field" id="${id}" placeholder="JSON or a plain value"></textarea></div>`;
  }
  const list = /address|member/i.test(arg.name) ? 'list="knownAddresses"' : '';
  return `<div class="arg">${label}<input class="field" id="${id}" value="${esc(prefill)}" ${list} autocomplete="off" /></div>`;
};

const NEEDS_TEXT = {
  permissionlessGate: 'a permissionless gate',
  curatedGates: 'curated gates',
  vettedGates: 'the ICS or IDVTC gate',
  gates: 'gates',
  metaRegistry: 'the MetaRegistry',
};
const moduleTags = (c) =>
  `<span class="mods">${
    c.modules.length === state.meta.modules.length
      ? '<span class="mod all">all modules</span>'
      : c.modules
          .map(
            (m) =>
              `<span class="mod ${m === state.module ? 'cur' : ''}">${m}</span>`,
          )
          .join('') || '<span class="mod">not on this chain</span>'
  }</span>`;

const renderCommands = () => {
  const query = $('search').value.trim().toLowerCase();
  const matches = (c, cat) =>
    [c.command, c.about, cat.name].some((text) =>
      text.toLowerCase().includes(query),
    );
  $('commands').innerHTML =
    state.meta.categories
      .map((cat) => {
        const cmds = cat.commands.filter((c) => !query || matches(c, cat));
        if (!cmds.length) return '';
        // a search shows every match, collapsed or not
        const closed = !query && state.collapsed.has(cat.name);
        return `<div class="group ${closed ? 'closed' : ''}">
      <button class="group-h" data-group="${esc(cat.name)}"><span class="chev">▾</span>${esc(cat.name)}<span class="count">${cmds.length}</span></button>
      <div class="group-body">${cmds
        .map(
          (c) => `
        <button class="cmd-item ${state.open === c.command ? 'on' : ''} ${c.modules.includes(state.module) ? '' : 'na'}" data-pick="${esc(c.command)}" title="${esc(c.args) || 'no arguments'}">
          <span class="name">${esc(c.command)}</span><span class="about">${esc(c.about)}</span>
          ${moduleTags(c)}
        </button>`,
        )
        .join('')}</div>
    </div>`;
      })
      .join('') || '<div class="empty">nothing found</div>';

  const c = allCommands().find((cmd) => cmd.command === state.open);
  if (!c) {
    $('commandDetail').innerHTML =
      '<div class="empty">pick a command on the left</div>';
    return;
  }
  const op = state.operator;
  $('commandDetail').innerHTML = `
    <form data-run="${esc(c.command)}">
      <div class="cmd-title">${esc(c.command)}</div>
      <div class="cmd-about">${esc(c.about)}</div>
      <div class="cmd-spec">${esc(c.args) || 'no arguments'}</div>
      ${moduleTags(c)}
      ${
        c.modules.includes(state.module)
          ? ''
          : `<div class="banner err" style="margin: 14px 0 0"><span class="grow"><b>not available in ${esc(state.module)}:</b>
        it needs ${esc(NEEDS_TEXT[c.needs] ?? c.needs)}, which ${esc(state.module)} does not have on this chain. Switch the module in the sidebar</span></div>`
      }
      <div class="ctx">
        <span class="badge plain ok">${esc(state.module)}</span>
        ${!c.args.includes('noId') ? '' : op ? `<span class="badge plain idle">operator #${op.id}</span>` : '<span>load an operator to prefill noId</span>'}
      </div>
      <div class="args-form">${parseArgs(c.args)
        .map((a, i) => fieldFor(c.command, a, i))
        .join('')}</div>
      <div class="example">$ ${esc(c.example)}</div>
      <button class="btn primary" ${c.modules.includes(state.module) ? '' : 'disabled'}>› run ${c.command}</button>
    </form>`;
  renderRoleNote();
};

const renderRoleNote = () => {
  for (const note of $('commandDetail').querySelectorAll('.arg-note')) {
    const role = state.meta.roles.find(
      (r) => r.name === $(note.id.replace(/-note$/, '')).value,
    );
    note.textContent = role ? role.about : '';
  }
};
$('commandDetail').addEventListener('change', renderRoleNote);

$('search').addEventListener('input', renderCommands);
$('commands').addEventListener('click', (event) => {
  const group = event.target.closest('[data-group]');
  if (group) {
    const name = group.dataset.group;
    state.collapsed.has(name)
      ? state.collapsed.delete(name)
      : state.collapsed.add(name);
    store.set('qa.collapsed', [...state.collapsed]);
    return renderCommands();
  }
  const el = event.target.closest('[data-pick]');
  if (!el) return;
  state.open = el.dataset.pick;
  store.set('qa.open', state.open);
  renderCommands();
});
$('commandDetail').addEventListener('submit', (event) => {
  event.preventDefault();
  const command = event.target.dataset.run;
  const spec = allCommands().find((c) => c.command === command);
  const args = [];
  for (const [i, arg] of parseArgs(spec.args).entries()) {
    const field = $(`arg-${command}-${i}`);
    if (field?.classList.contains('pick')) {
      const picked = [...field.querySelectorAll('input:checked')].map(
        (el) => el.value,
      );
      if (!picked.length) return toast('pick at least one gate', true);
      args.push(picked.length === 1 ? picked[0] : JSON.stringify(picked));
      continue;
    }
    if (!field) return toast(`nothing to pick for ${arg.name}`, true);
    const value = field.value.trim();
    if (!value) {
      if (arg.optional) break;
      return toast(`fill in ${arg.name}`, true);
    }
    args.push(...(arg.variadic ? value.split(/[\s,]+/) : [value]));
  }
  if (
    command === 'revert' &&
    !confirm('Revert the fork? Everything done since the snapshot is lost')
  )
    return;
  run(command, args);
});

/* ---------- misc ---------- */

const setModule = (module) => {
  if (module === state.module) return;
  state.module = module;
  store.set('qa.module', module);
  renderModules();
  state.operator = null;
  $('operatorTitle').textContent = 'Operator keys';
  $('operatorSummary').textContent = `${module}: enter an operator id`;
  $('operator').innerHTML = '';
  $('operatorActions').hidden = true;
  setBadge('navOperator', null);
  renderCommands();
  renderKnownAddresses();
  if (state.presets) renderPresets();
};

document.addEventListener('click', (event) => {
  const el = event.target.closest('.copy');
  if (
    !el ||
    el.id === 'clearLog' ||
    el.id === 'nonceAck' ||
    el.dataset.reveal ||
    el.dataset.secret
  )
    return;
  const text = el.dataset.text ?? $(el.dataset.copy)?.dataset.value;
  if (text) copy(text, el.dataset.label);
});
$('clearLog').addEventListener('click', () => {
  state.logCleared = Date.now();
  renderLog();
});
$('chains').addEventListener('click', (event) => {
  const next = event.target.dataset.chain;
  if (!next || next === chain) return;
  store.set('qa.chain', next);
  location.reload();
});
$('modules').addEventListener(
  'click',
  (event) =>
    event.target.dataset.module && setModule(event.target.dataset.module),
);
$('snapshotLink').addEventListener('click', takeSnapshot);
$('revertLink').addEventListener('click', revertSnapshot);
$('resetCl').addEventListener('click', async () => {
  if (!confirm('Clear the CL mock for every key?')) return;
  await api('/api/cl/reset', {});
  if (state.operator) {
    for (const k of state.operator.keys) k.cl = null;
    renderOperator();
  }
  pollState();
  toast('CL mock cleared');
});

(async () => {
  showView(viewFromHash() || 'setup');
  state.meta = await api('/api/meta');
  if (!state.meta.modules.includes(state.module))
    state.module = state.meta.modules[0];
  renderChains();
  renderModules();
  renderCommands();
  renderSnapshot();
  await Promise.all([pollState(), loadHistory(), loadPresets()]);
  setInterval(pollState, 5000);
  const lastId = store.get(chainKey('qa.noId'), null);
  if (lastId !== null) {
    $('noId').value = lastId;
    loadOperator(lastId);
  }
})();
