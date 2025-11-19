export const getArraySum = (values?: number[]): number =>
  values?.reduce((a, b) => a + b, 0) ?? 0;
