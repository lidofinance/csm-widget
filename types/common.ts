export type LoadingRecord<T extends string> = Record<
  `is${Capitalize<T>}Loading`,
  boolean
>;
