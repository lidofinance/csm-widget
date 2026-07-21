import { useCallback } from 'react';
import { readFiles } from '../utils/read-files';
import { validateDkgFile } from '../utils/validate-dkg-file';
import type { ProcessedDkgFiles } from '../types';

export const useProcessDkgFiles = () =>
  useCallback(async (files: File[]): Promise<ProcessedDkgFiles> => {
    const read = await readFiles(files);
    const result: ProcessedDkgFiles = { valid: [], rejected: [] };
    for (const { name, text } of read) {
      const v = validateDkgFile(name, text);
      if (v.ok) result.valid.push(v.item);
      else result.rejected.push({ name, reason: v.reason });
    }
    return result;
  }, []);
