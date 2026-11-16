import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const { inc, labels } = vi.hoisted(() => {
  const inc = vi.fn();
  return { inc, labels: vi.fn(() => ({ inc })) };
});
vi.mock('utilsApi/metrics', () => ({
  default: { request: { validationFileLoadError: { labels } } },
}));

import { isAddressDenied } from '../load-validation-file';

const LISTED = '0xAbCdEf0000000000000000000000000000000001';
const OTHER = '0x0000000000000000000000000000000000000002';

let dir: string;
let counter = 0;

// fresh path per test: the loader cache is keyed by path
const writeFile = async (content: string) => {
  const file = path.join(dir, `deny-${counter++}.json`);
  await fs.writeFile(file, content);
  process.env.VALIDATION_FILE_PATH = file;
  return file;
};

describe('isAddressDenied', () => {
  beforeAll(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'deny-list-'));
  });
  afterAll(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });
  beforeEach(() => {
    inc.mockClear();
    labels.mockClear();
    delete process.env.VALIDATION_FILE_PATH;
  });

  test('denies a listed address and allows others', async () => {
    await writeFile(JSON.stringify({ addresses: [LISTED] }));
    expect(await isAddressDenied(LISTED)).toBe(true);
    expect(await isAddressDenied(OTHER)).toBe(false);
  });

  test('matches case-insensitively and trims entries', async () => {
    await writeFile(JSON.stringify({ addresses: [` ${LISTED} `] }));
    expect(await isAddressDenied(LISTED.toLowerCase())).toBe(true);
    expect(
      await isAddressDenied(LISTED.toUpperCase().replace('0X', '0x')),
    ).toBe(true);
  });

  test('reloads when mtime changes', async () => {
    const file = await writeFile(JSON.stringify({ addresses: [] }));
    expect(await isAddressDenied(LISTED)).toBe(false);

    await fs.writeFile(file, JSON.stringify({ addresses: [LISTED] }));
    const later = new Date(Date.now() + 10_000);
    await fs.utimes(file, later, later);

    expect(await isAddressDenied(LISTED)).toBe(true);
  });

  test('denies nothing without VALIDATION_FILE_PATH', async () => {
    expect(await isAddressDenied(LISTED)).toBe(false);
    expect(inc).not.toHaveBeenCalled();
  });

  test('denies nothing for an empty file, without an error metric', async () => {
    await writeFile('   ');
    expect(await isAddressDenied(LISTED)).toBe(false);
    expect(inc).not.toHaveBeenCalled();
  });

  test.each([
    ['stat_failed', null],
    ['invalid_json', '{not json'],
    ['invalid_format', JSON.stringify({ addresses: [1, 2] })],
  ])('denies nothing and reports %s', async (bucket, content) => {
    if (content === null) {
      process.env.VALIDATION_FILE_PATH = path.join(dir, 'missing.json');
    } else {
      await writeFile(content);
    }
    expect(await isAddressDenied(LISTED)).toBe(false);
    expect(labels).toHaveBeenCalledWith({ error: bucket });
    expect(inc).toHaveBeenCalledWith(1);
  });
});
