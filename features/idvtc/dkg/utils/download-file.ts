import { downloadBlob } from 'utils/download-blob';

export const downloadJson = (name: string, content: unknown): void => {
  const fileName = name.toLowerCase().endsWith('.json') ? name : `${name}.json`;
  downloadBlob(
    fileName,
    new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    }),
  );
};
