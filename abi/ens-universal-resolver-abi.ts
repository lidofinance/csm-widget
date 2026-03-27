// ENS Universal Resolver ABI (resolve + reverse functions used by viem)
export const ENSUniversalResolverAbi = [
  {
    name: 'resolveWithGateways',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'name', type: 'bytes' },
      { name: 'data', type: 'bytes' },
      { name: 'gateways', type: 'string[]' },
    ],
    outputs: [
      { name: '', type: 'bytes' },
      { name: 'address', type: 'address' },
    ],
  },
  {
    name: 'reverseWithGateways',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'bytes', name: 'reverseName' },
      { type: 'uint256', name: 'coinType' },
      { type: 'string[]', name: 'gateways' },
    ],
    outputs: [
      { type: 'string', name: 'resolvedName' },
      { type: 'address', name: 'resolver' },
      { type: 'address', name: 'reverseResolver' },
    ],
  },
] as const;
