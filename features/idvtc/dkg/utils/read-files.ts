import { readFileAsText } from 'utils/read-file-as-text';

export type ReadFile = { name: string; text: string };

export const readFiles = (files: File[]): Promise<ReadFile[]> =>
  Promise.all(
    files.map(async (file) => ({
      name: file.name,
      text: await readFileAsText(file),
    })),
  );
