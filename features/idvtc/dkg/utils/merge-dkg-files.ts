// Merge staged DKG files with newly added ones, deduplicating by content.
// File names are operator-defined and not unique, so identity is the parsed
// JSON content: adding the same file twice (under any name) collapses to one,
// while files that differ in content are all kept. First occurrence wins and
// order is preserved.
export const mergeDkgFiles = <T extends { content: unknown }>(
  existing: T[],
  incoming: T[],
): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const file of [...existing, ...incoming]) {
    const key = JSON.stringify(file.content);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(file);
  }
  return result;
};
