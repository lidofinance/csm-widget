import { renderToStaticMarkup } from 'react-dom/server';
import { getKeysNeededVariant, KeysNeededTag } from './keys-needed-tag';

const render = (props: Parameters<typeof KeysNeededTag>[0]) =>
  renderToStaticMarkup(<KeysNeededTag {...props} />);

describe('getKeysNeededVariant', () => {
  it.each([
    [0, false, 'success'],
    [0, true, 'success'],
    [2, false, 'warning'],
    [2, true, 'error'],
  ])('%s keys, empty %s -> %s', (count, empty, expected) => {
    expect(getKeysNeededVariant(count, empty)).toBe(expected);
  });
});

describe('KeysNeededTag', () => {
  it('renders nothing while pending', () => {
    expect(render({ potentialAdditionalKeys: 2, pending: true })).toBe('');
  });

  it('renders nothing for a zero-weight member', () => {
    expect(render({ potentialAdditionalKeys: 2, weightZero: true })).toBe('');
  });

  it('renders nothing without data', () => {
    expect(render({ potentialAdditionalKeys: undefined })).toBe('');
  });

  it('shows Enough keys for zero', () => {
    const html = render({ potentialAdditionalKeys: 0 });
    expect(html).toContain('Enough keys');
    expect(html).toContain('data-testid="moreKeysChip"');
  });

  it('uses the singular for one key', () => {
    const html = render({ potentialAdditionalKeys: 1, empty: false });
    expect(html).toContain('Add 1 more key');
    expect(html).not.toContain('more keys');
    expect(html).toContain('data-testid="moreKeysChip"');
  });

  it('uses the plural for several keys', () => {
    const html = render({ potentialAdditionalKeys: 3, empty: true });
    expect(html).toContain('Add 3 more keys');
    expect(html).toContain('data-testid="moreKeysChip"');
  });
});
