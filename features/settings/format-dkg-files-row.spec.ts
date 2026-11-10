import { formatDkgFilesRow } from './format-dkg-files-row';

const files = [{ active: true }, { active: true }, { active: false }];

describe('formatDkgFilesRow', () => {
  it('has no value while files are unknown', () => {
    expect(formatDkgFilesRow(undefined, false)).toEqual({
      title: 'Uploaded DKG files',
    });
  });

  it('marks zero files as empty', () => {
    expect(formatDkgFilesRow([], false)).toEqual({
      title: 'Uploaded DKG files',
      isEmpty: true,
    });
    expect(formatDkgFilesRow([], true).isEmpty).toBe(true);
  });

  it('counts active and disabled files for the CSM family', () => {
    expect(formatDkgFilesRow(files, false)).toEqual({
      title: 'Uploaded DKG files',
      value: '2 active, 1 disabled',
    });
  });

  it('puts the total in the title for CM', () => {
    expect(formatDkgFilesRow(files, true)).toEqual({
      title: '3 uploaded files',
      value: '2 active',
    });
    expect(formatDkgFilesRow([{ active: true }], true).title).toBe(
      '1 uploaded file',
    );
  });
});
