/**
 * true, 'true' and 1, '1' map to true; everything else to false.
 * @returns {boolean}
 */
export const toBoolean = (dataStr) => {
  return (
    dataStr?.toLowerCase?.() === 'true' ||
    dataStr === true ||
    Number.parseInt(dataStr, 10) === 1
  );
};
