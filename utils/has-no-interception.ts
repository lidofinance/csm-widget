export const hasNoInterception = <T>(input: T[], filter: T[]) =>
  input.every((st) => !filter.includes(st));
