export const trimOx = (string: string): string => {
  return string.replace(/^0x/g, '');
};
