import { SizeTooLargeError } from './errors';
import { readJsonCapped } from './read-json-capped';

const streamOf = (chunks: string[], cancel = vi.fn(), keepOpen = false) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(new TextEncoder().encode(c));
      if (!keepOpen) controller.close();
    },
    cancel,
  });

describe('readJsonCapped', () => {
  it('parses body under the cap', async () => {
    const res = new Response(streamOf(['{"a":', '1}']));
    await expect(readJsonCapped(res, 100)).resolves.toEqual({ a: 1 });
  });

  it('throws SizeTooLargeError and cancels the stream over the cap', async () => {
    const cancel = vi.fn();
    const res = new Response(
      streamOf(['{"a":', '"xxxxxxxxxx"}'], cancel, true),
    );
    await expect(readJsonCapped(res, 8)).rejects.toBeInstanceOf(
      SizeTooLargeError,
    );
    expect(cancel).toHaveBeenCalled();
  });

  it('throws on invalid JSON', async () => {
    await expect(readJsonCapped(new Response('nope'))).rejects.toThrow();
  });

  it('throws when there is no body', async () => {
    await expect(
      readJsonCapped(new Response(null, { status: 200 })),
    ).rejects.toThrow('no body');
  });
});
