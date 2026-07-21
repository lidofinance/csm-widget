export type ReadFile = { name: string; text: string };

const readOne = (file: File): Promise<ReadFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      resolve({ name: file.name, text: String(reader.result ?? '') }),
    );
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsText(file);
  });

export const readFiles = (files: File[]): Promise<ReadFile[]> =>
  Promise.all(files.map(readOne));
