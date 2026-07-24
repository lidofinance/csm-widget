import {
  validateDkgFile,
  MAX_CONTENT_BYTES,
  MAX_NAME_LENGTH,
} from './validate-dkg-file';

describe('validateDkgFile', () => {
  it('accepts valid json and returns parsed content', () => {
    const r = validateDkgFile('a.json', '{"x":1}');
    expect(r.ok).toBe(true);
    expect(r).toMatchObject({
      ok: true,
      item: { name: 'a.json', content: { x: 1 } },
    });
  });

  it('rejects malformed json', () => {
    const r = validateDkgFile('a.json', '{bad');
    expect(r.ok).toBe(false);
    expect(r).toMatchObject({
      ok: false,
      reason: expect.stringMatching(/json/i),
    });
  });

  it('rejects name longer than the limit', () => {
    const longName = 'x'.repeat(MAX_NAME_LENGTH + 1) + '.json';
    const r = validateDkgFile(longName, '{}');
    expect(r.ok).toBe(false);
    expect(r).toMatchObject({
      ok: false,
      reason: expect.stringMatching(/name/i),
    });
  });

  it('accepts a name at the exact length limit', () => {
    const name = 'x'.repeat(MAX_NAME_LENGTH);
    const r = validateDkgFile(name, '{}');
    expect(r).toMatchObject({ ok: true });
  });

  it('rejects content larger than the size limit', () => {
    const big = JSON.stringify({ blob: 'y'.repeat(MAX_CONTENT_BYTES) });
    const r = validateDkgFile('a.json', big);
    expect(r.ok).toBe(false);
    expect(r).toMatchObject({
      ok: false,
      reason: expect.stringMatching(/large|size/i),
    });
  });

  it('accepts a top-level array', () => {
    const r = validateDkgFile('a.json', '[1,2,3]');
    expect(r).toMatchObject({ ok: true });
  });

  it('rejects a top-level number', () => {
    const r = validateDkgFile('a.json', '42');
    expect(r).toMatchObject({
      ok: false,
      reason: 'Not a valid DKG file',
    });
  });

  it('rejects a top-level string', () => {
    const r = validateDkgFile('a.json', '"hello"');
    expect(r).toMatchObject({
      ok: false,
      reason: 'Not a valid DKG file',
    });
  });

  it('rejects a top-level null', () => {
    const r = validateDkgFile('a.json', 'null');
    expect(r).toMatchObject({
      ok: false,
      reason: 'Not a valid DKG file',
    });
  });

  it('rejects a top-level boolean', () => {
    const r = validateDkgFile('a.json', 'true');
    expect(r).toMatchObject({
      ok: false,
      reason: 'Not a valid DKG file',
    });
  });
});
