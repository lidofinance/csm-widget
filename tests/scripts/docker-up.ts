import { spawnSync } from 'node:child_process';

// Starts the docker stack of the given networks (hoodi by default): their forks
// and everything shared, see compose.yaml. Prints the public URLs after.
//
//   yarn docker:up                 # hoodi
//   yarn docker:up mainnet         # mainnet, next to hoodi if it is up
//   yarn docker:up hoodi mainnet   # both

const NETWORKS = ['hoodi', 'mainnet'];

const networks = process.argv.slice(2);
const unknown = networks.find((network) => !NETWORKS.includes(network));
if (unknown) {
  console.error(`Unknown network ${unknown}: use ${NETWORKS.join(' or ')}`);
  process.exit(1);
}

const compose = (...args: string[]) =>
  spawnSync('docker', ['compose', '--env-file', 'fork.env', ...args], {
    stdio: 'inherit',
  }).status;

const profiles = (networks.length > 0 ? networks : ['hoodi']).flatMap(
  (network) => ['--profile', network],
);
const status = compose(...profiles, 'up', '-d', '--wait');
if (status !== 0) process.exit(status ?? 1);
process.exit(compose('run', '--rm', 'tunnel-url') ?? 1);
