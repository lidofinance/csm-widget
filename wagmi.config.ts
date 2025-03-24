import { defineConfig, loadEnv } from '@wagmi/cli';
import { actions, react } from '@wagmi/cli/plugins';
import { holesky, hoodi, mainnet } from 'viem/chains';
import { CSAccountingAbi } from './abi/CSAccounting';
import { CSEarlyAdoptionAbi } from './abi/CSEarlyAdoption';
import { CSModuleAbi } from './abi/CSModule';

const CHAINS = [mainnet.id, holesky.id, hoodi.id] as const;

type Chains = (typeof CHAINS)[number];

loadEnv();

const addresses = {
  CSModule: {
    [mainnet.id]: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
    [holesky.id]: '0x4562c3e63c2e586cD1651B958C22F88135aCAd4f',
    [hoodi.id]: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
  },
  CSAccounting: {
    [mainnet.id]: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
    [holesky.id]: '0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1',
    [hoodi.id]: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
  },
  CSEarlyAdoption: {
    [mainnet.id]: '0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E',
    [holesky.id]: '0x71E92eA77C198a770d9f33A03277DbeB99989660',
    [hoodi.id]: '0x3281b9E45518F462E594697f8fba1896a8B43939',
  },
} as const;

const getContractAddress = (
  contract: keyof typeof addresses,
  chainId: Chains,
) => addresses[contract][chainId];

const chainId = Number.parseInt(process.env.DEFAULT_CHAIN || '', 10) as Chains;
if (!CHAINS.includes(chainId)) {
  throw new Error(`unsupported chainId ${chainId}`);
}

export default defineConfig({
  out: 'modules/web3/generated.ts',
  contracts: [
    {
      name: 'CSModule',
      address: getContractAddress('CSModule', chainId),
      abi: CSModuleAbi,
    },
    {
      name: 'CSAccounting',
      address: getContractAddress('CSAccounting', chainId),
      abi: CSAccountingAbi,
    },
    {
      name: 'CSEarlyAdoption',
      address: getContractAddress('CSEarlyAdoption', chainId),
      abi: CSEarlyAdoptionAbi,
    },
  ],
  plugins: [actions(), react()],
});
