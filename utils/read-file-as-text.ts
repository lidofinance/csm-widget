// Reads a Blob/File as text, resolving with its contents and rejecting on a
// read error so callers can surface unreadable files.
export const readFileAsText = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result ?? '')));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsText(file);
  });
