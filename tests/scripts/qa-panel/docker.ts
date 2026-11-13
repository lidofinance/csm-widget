import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';

// The services from compose.yaml, one profile each, and the one cloudflared
// quick tunnel in front of them, routed by path

const exec = promisify(execFile);

export const PROFILES = ['hoodi', 'mainnet', 'ipfs', 'cl', 'tunnel'] as const;
export type Profile = (typeof PROFILES)[number];

const SERVICES: Record<Profile, string> = {
  hoodi: 'hoodi',
  mainnet: 'mainnet',
  ipfs: 'ipfs',
  cl: 'cl-mock',
  tunnel: 'tunnel',
};
const CONTAINERS: Record<Profile, string> = {
  ...SERVICES,
  hoodi: 'hoodi-fork',
  mainnet: 'mainnet-fork',
};

/** Where each service sits behind the tunnel (the caddyfile config in compose.yaml) */
export const TUNNEL_PATHS = {
  hoodi: '/hoodi',
  mainnet: '/mainnet',
  cl: '/cl',
  ipfs: '/ipfs/{cid}',
} as const;

type Container = {
  status: string;
  health: string | null;
  startedAt: string;
};

export type ProfileState = {
  profile: Profile;
  node: Container | null;
};

// A quick tunnel gets a new URL on every start, so cache by start time
const tunnelUrls = new Map<string, string>();

const readTunnelUrl = async (startedAt: string) => {
  if (!tunnelUrls.has(startedAt)) {
    const url = await exec('docker', ['logs', CONTAINERS.tunnel])
      .then(({ stdout, stderr }) =>
        `${stdout}${stderr}`
          .match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/g)
          ?.at(-1),
      )
      .catch(() => undefined);
    // the URL shows up a few seconds after start: don't cache a miss
    if (!url) return null;
    tunnelUrls.set(startedAt, url);
  }
  return tunnelUrls.get(startedAt) ?? null;
};

const inspect = async (names: string[]) => {
  const { stdout } = await exec('docker', ['inspect', ...names]).catch(
    // `docker inspect` fails as a whole if one name is missing
    (error) => ({ stdout: error.stdout as string }),
  );
  const found: {
    Name: string;
    State: { Status: string; StartedAt: string; Health?: { Status: string } };
  }[] = stdout ? JSON.parse(stdout) : [];

  return new Map(
    found.map(({ Name, State }) => [
      Name.replace(/^\//, ''),
      {
        status: State.Status,
        health: State.Health?.Status ?? null,
        startedAt: State.StartedAt,
      } satisfies Container,
    ]),
  );
};

export const readDocker = async () => {
  try {
    await exec('docker', ['version', '--format', '{{.Server.Version}}']);
  } catch {
    return {
      available: false,
      profiles: [] as ProfileState[],
      tunnelUrl: null,
    };
  }

  const containers = await inspect(PROFILES.map((p) => CONTAINERS[p]));
  const tunnel = containers.get(CONTAINERS.tunnel);
  return {
    available: true,
    profiles: PROFILES.map((profile): ProfileState => ({
      profile,
      node: containers.get(CONTAINERS[profile]) ?? null,
    })),
    tunnelUrl:
      tunnel?.status === 'running'
        ? await readTunnelUrl(tunnel.startedAt)
        : null,
  };
};

export const DOCKER_ACTIONS = {
  // waiting for the healthcheck: the tunnel's passes once it has its URL
  up: (p: Profile) => ['up', '-d', '--wait', SERVICES[p]],
  // a fork resets to the live chain; the tunnel gets a new URL
  restart: (p: Profile) => ['restart', SERVICES[p]],
  stop: (p: Profile) => ['rm', '--stop', '--force', SERVICES[p]],
} as const;
export type DockerAction = keyof typeof DOCKER_ACTIONS;

export const composeArgs = (profile: Profile, action: DockerAction) => [
  'compose',
  '--env-file',
  'fork.env',
  '--profile',
  profile,
  ...DOCKER_ACTIONS[action](profile),
];

/** Runs docker, passing each output line on as it comes */
export const runDocker = (args: string[], onLine: (line: string) => void) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn('docker', args);
    let last = '';
    const read = (chunk: Buffer) => {
      for (const line of chunk.toString().split(/\r?\n/)) {
        if (!line.trim()) continue;
        last = line.trim();
        onLine(last);
      }
    };
    child.stdout.on('data', read);
    child.stderr.on('data', read);
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(last || `exit code ${code}`)),
    );
  });
