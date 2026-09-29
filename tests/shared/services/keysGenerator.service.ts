import { bls12_381 as bls } from '@noble/curves/bls12-381';
import { sha256 } from '@noble/hashes/sha2';

export type DepositKey = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  network_name: string;
  deposit_cli_version: string;
};

export type KeysGeneratorOptions = {
  isCM?: boolean;
  chain: string;
  withdrawalCredentials: string;
};

const DEPOSIT_AMOUNT_GWEI = 32_000_000_000;
const DEPOSIT_CLI_VERSION = '2.8.0';
const DOMAIN_DEPOSIT = '03000000';
const SIGNATURE_DST = 'BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_';
const FORK_VERSION: Record<string, string> = {
  mainnet: '00000000',
  hoodi: '10000910',
};

const toBytes = (hex: string): Uint8Array =>
  Uint8Array.from(Buffer.from(hex.replace(/^0x/, ''), 'hex'));

const toHex = (bytes: Uint8Array): string => Buffer.from(bytes).toString('hex');

const concat = (...parts: Uint8Array[]): Uint8Array =>
  Uint8Array.from(Buffer.concat(parts.map((part) => Buffer.from(part))));

const padTo32 = (bytes: Uint8Array): Uint8Array => {
  const chunk = new Uint8Array(32);
  chunk.set(bytes);
  return chunk;
};

/** Binary merkle root of 32-byte chunks, zero-padded to a power of two. */
const merkleize = (chunks: Uint8Array[]): Uint8Array => {
  const leaves = 2 ** Math.ceil(Math.log2(chunks.length));
  let layer = [
    ...chunks,
    ...Array.from({ length: leaves - chunks.length }, () => new Uint8Array(32)),
  ];
  while (layer.length > 1) {
    const next: Uint8Array[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      next.push(sha256(concat(layer[i], layer[i + 1])));
    }
    layer = next;
  }
  return layer[0];
};

/** hash_tree_root of a fixed-size byte vector. */
const bytesRoot = (bytes: Uint8Array): Uint8Array => {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += 32) {
    chunks.push(padTo32(bytes.subarray(i, i + 32)));
  }
  return merkleize(chunks);
};

/** hash_tree_root of an uint64: little-endian, right-padded to a chunk. */
const uint64Root = (value: number): Uint8Array => {
  const chunk = new Uint8Array(32);
  new DataView(chunk.buffer).setBigUint64(0, BigInt(value), true);
  return chunk;
};

/** 0x01 / 0x02 withdrawal credentials: type byte, 11 zero bytes, 20-byte address. */
const buildWithdrawalCredentials = (
  address: string,
  isCompounding: boolean,
): Uint8Array => {
  const credentials = new Uint8Array(32);
  credentials[0] = isCompounding ? 0x02 : 0x01;
  credentials.set(toBytes(address), 12);
  return credentials;
};

/** compute_domain with an all-zero genesis validators root, as deposits use. */
const computeDomain = (forkVersion: string): Uint8Array => {
  const forkDataRoot = sha256(
    concat(padTo32(toBytes(forkVersion)), new Uint8Array(32)),
  );
  return concat(toBytes(DOMAIN_DEPOSIT), forkDataRoot.subarray(0, 28));
};

export class KeysGeneratorService {
  constructor(private options: KeysGeneratorOptions) {}

  /**
   * Generates valid deposit data for CSM/CM with random keys
   * @param numValidators - number of validators (default 1)
   * @returns deposit data entries, the same shape a deposit CLI writes
   * @throws Error if the configured chain is unknown
   */
  generateKeys(numValidators = 1): DepositKey[] {
    const { chain, withdrawalCredentials, isCM } = this.options;

    const forkVersion = FORK_VERSION[chain];
    if (!forkVersion) {
      throw new Error(`Failed to generate keys: unknown chain ${chain}`);
    }

    const credentials = buildWithdrawalCredentials(
      withdrawalCredentials,
      !!isCM,
    );
    const domain = computeDomain(forkVersion);
    const amountRoot = uint64Root(DEPOSIT_AMOUNT_GWEI);

    return Array.from({ length: numValidators }, () => {
      const secretKey = bls.utils.randomSecretKey();
      const pubkey = bls.longSignatures.getPublicKey(secretKey).toBytes();

      const messageRoot = merkleize([
        bytesRoot(pubkey),
        credentials,
        amountRoot,
      ]);
      const signingRoot = sha256(concat(messageRoot, domain));
      const signature = bls.longSignatures
        .sign(bls.longSignatures.hash(signingRoot, SIGNATURE_DST), secretKey)
        .toBytes();
      const dataRoot = merkleize([
        bytesRoot(pubkey),
        credentials,
        amountRoot,
        bytesRoot(signature),
      ]);

      return {
        pubkey: toHex(pubkey),
        withdrawal_credentials: toHex(credentials),
        amount: DEPOSIT_AMOUNT_GWEI,
        signature: toHex(signature),
        deposit_message_root: toHex(messageRoot),
        deposit_data_root: toHex(dataRoot),
        fork_version: forkVersion,
        network_name: chain,
        deposit_cli_version: DEPOSIT_CLI_VERSION,
      };
    });
  }
}
