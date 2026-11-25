export const trimAddress = (address: string, symbols: number): string => {
  if (symbols <= 0) return '';
  if (symbols * 2 >= address.length) return address;
  return `${address.slice(0, symbols)}...${address.slice(-symbols)}`;
};
