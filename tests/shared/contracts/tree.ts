import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import type { Hex } from './constants';

export const IPFS_API_URL = process.env.IPFS_API_URL ?? 'http://127.0.0.1:5001';
export const IPFS_GATEWAY_URL =
  process.env.IPFS_GATEWAY_URL ?? 'http://127.0.0.1:8080';
const IPFS_TIMEOUT_MS = 10_000;

export const pinJson = async (name: string, json: string): Promise<string> => {
  const form = new FormData();
  form.append('file', new Blob([json], { type: 'application/json' }), name);

  const res = await fetch(
    `${IPFS_API_URL}/api/v0/add?pin=true&cid-version=0&quieter=true`,
    {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(IPFS_TIMEOUT_MS),
    },
  );
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`IPFS add failed: ${res.status} ${body}`);
  }

  const lines = body.trim().split('\n').filter(Boolean);
  const last = lines[lines.length - 1];
  if (!last) {
    throw new Error(`IPFS add returned no entries: ${body}`);
  }

  const { Hash } = JSON.parse(last) as { Hash: string };
  return Hash;
};

export const pinTree = async (addresses: Hex[]) => {
  const tree = StandardMerkleTree.of(
    addresses.map((address) => [address]),
    ['address'],
  );
  const cid = await pinJson(
    'merkle-tree.json',
    JSON.stringify(tree.dump(), null, 2),
  );
  return { tree, root: tree.root as Hex, cid };
};
