export const getArraySum = (values?: readonly number[]): number =>
  values?.reduce((a, b) => a + b, 0) ?? 0;
