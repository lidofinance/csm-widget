import { SizeTooLargeError } from './errors';

export const readJsonCapped = async (
  res: Response,
  maxBytes = 16_384,
): Promise<unknown> => {
  if (!res.body) throw new Error('Response has no body');

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new SizeTooLargeError();
    }
    chunks.push(value);
  }

  const text = new TextDecoder().decode(Buffer.concat(chunks));
  return JSON.parse(text);
};
