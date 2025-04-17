export const CSModuleOldAbi = [
  {
    type: 'event',
    name: 'InitialSlashingSubmitted',
    inputs: [
      {
        name: 'nodeOperatorId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'keyIndex',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },

  {
    type: 'event',
    name: 'WithdrawalSubmitted',
    inputs: [
      {
        name: 'nodeOperatorId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'keyIndex',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
] as const;
