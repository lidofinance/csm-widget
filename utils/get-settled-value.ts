export const getSettledValue = <T>(result: PromiseSettledResult<T>) => {
  return result.status === 'fulfilled' ? result.value : undefined;
};
