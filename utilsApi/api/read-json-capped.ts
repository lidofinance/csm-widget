import { SizeTooLargeError } from './errors';

export const readJsonCapped = async (
  res: Response,
  maxBytes = 16_384,
): Promise<unknown> => {
  if (!res.body) throw new Error('Response has no body');

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let chunk = await reader.read();
  while (!chunk.done) {
    total += chunk.value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new SizeTooLargeError();
    }
    chunks.push(chunk.value);
    chunk = await reader.read();
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};
