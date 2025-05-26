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

const getRandomHex = (length: number): string => {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const generateDepositKey = (): DepositKey => {
  return {
    pubkey: getRandomHex(96),
    withdrawal_credentials: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
    amount: 32000000000,
    signature: getRandomHex(192),
    deposit_message_root: getRandomHex(64),
    deposit_data_root: getRandomHex(64),
    fork_version: '10000910',
    network_name: 'hoodi',
    deposit_cli_version: '2.7.0',
  };
};

export const getRandomKeys = (count = 1) => {
  return Array.from({ length: count }, generateDepositKey);
};
