import { mergeDkgFiles } from './merge-dkg-files';

describe('mergeDkgFiles', () => {
  it('deduplicates identical content across batches', () => {
    const staged = [{ name: 'a.json', content: { x: 1 } }];
    const incoming = [{ name: 'a.json', content: { x: 1 } }];
    expect(mergeDkgFiles(staged, incoming)).toEqual([
      { name: 'a.json', content: { x: 1 } },
    ]);
  });

  it('deduplicates identical content regardless of file name', () => {
    const staged = [{ name: 'a.json', content: { x: 1 } }];
    const incoming = [{ name: 'copy.json', content: { x: 1 } }];
    // same DKG data added under a different name collapses to the first entry
    expect(mergeDkgFiles(staged, incoming)).toEqual([
      { name: 'a.json', content: { x: 1 } },
    ]);
  });

  it('keeps files that share a name but differ in content', () => {
    const staged = [{ name: 'keys.json', content: { v: 1 } }];
    const incoming = [{ name: 'keys.json', content: { v: 2 } }];
    expect(mergeDkgFiles(staged, incoming)).toEqual([
      { name: 'keys.json', content: { v: 1 } },
      { name: 'keys.json', content: { v: 2 } },
    ]);
  });

  it('appends genuinely new content after existing ones', () => {
    const staged = [{ name: 'a.json', content: { a: 1 } }];
    const incoming = [{ name: 'b.json', content: { b: 1 } }];
    expect(
      mergeDkgFiles<{ name: string; content: unknown }>(staged, incoming).map(
        (f) => f.name,
      ),
    ).toEqual(['a.json', 'b.json']);
  });

  it('deduplicates identical content within a single incoming batch', () => {
    const incoming = [
      { name: 'a.json', content: { v: 1 } },
      { name: 'b.json', content: { v: 1 } },
    ];
    expect(mergeDkgFiles([], incoming)).toEqual([
      { name: 'a.json', content: { v: 1 } },
    ]);
  });

  it('does not mutate the input arrays', () => {
    const staged = [{ name: 'a.json', content: { x: 1 } }];
    const incoming = [{ name: 'a.json', content: { x: 1 } }];
    mergeDkgFiles(staged, incoming);
    expect(staged).toHaveLength(1);
    expect(incoming).toHaveLength(1);
  });
});
