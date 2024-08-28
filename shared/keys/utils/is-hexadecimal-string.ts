export const isHexadecimalString = (input: string): boolean => {
  if (typeof input !== 'string') return false;

  return /^[0-9a-fA-F]+$/.test(input);
};
