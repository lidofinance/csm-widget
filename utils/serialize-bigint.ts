export const serializeBigInt = (_key: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

export const noopValue = (value: any) => value;
