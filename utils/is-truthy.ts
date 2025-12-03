/**
 * Determines if a query parameter value should be considered truthy.
 * Handles common falsy string values like '0', 'false', and empty strings.
 *
 * @param value - The query parameter value to check
 * @returns true if the value should be considered truthy, false otherwise
 *
 * @example
 * isTruthy('1') // true
 * isTruthy('true') // true
 * isTruthy('yes') // true
 * isTruthy('0') // false
 * isTruthy('false') // false
 * isTruthy('') // true (empty string is considered as flag present)
 * isTruthy(null) // false
 */
export const isTruthy = (value: string | null): boolean => {
  if (value === '') return true;
  if (!value) return false;
  const normalized = value.toLowerCase();
  return normalized !== '0' && normalized !== 'false';
};
