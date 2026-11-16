export const DELETE_MODES = ['remove', 'exit', 'eject'] as const;
export type DeleteMode = (typeof DELETE_MODES)[number];

export const isDeleteMode = (value: unknown): value is DeleteMode =>
  typeof value === 'string' &&
  (DELETE_MODES as readonly string[]).includes(value);

export const resolveDeleteMode = (
  query: unknown,
  available: DeleteMode[],
): DeleteMode | undefined =>
  isDeleteMode(query) && available.includes(query) ? query : available[0];
