import { readFiles } from './read-files';
import { validateDkgFile } from './validate-dkg-file';
import type { ProcessedDkgFiles } from '../types';

// Read a batch of dropped files and split them into validated upload items and
// rejections. Pure and presentation-free — the upload zone hook calls it once
// per drop; it holds no state and captures no File references past the call.
export const processDkgFiles = async (
  files: File[],
): Promise<ProcessedDkgFiles> => {
  const read = await readFiles(files);
  const result: ProcessedDkgFiles = { valid: [], rejected: [] };
  for (const { name, text } of read) {
    const v = validateDkgFile(name, text);
    if (v.ok) result.valid.push(v.item);
    else result.rejected.push({ name, reason: v.reason });
  }
  return result;
};
