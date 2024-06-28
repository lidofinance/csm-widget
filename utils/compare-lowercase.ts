export const compareLowercase = (value1?: string, value2?: string) =>
  value1 !== undefined &&
  value1.toLocaleLowerCase() === value2?.toLocaleLowerCase();
