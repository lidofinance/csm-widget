export const hasInterception = <T>(input: T[], filter: T[]) =>
  input.some((st) => filter.includes(st));
