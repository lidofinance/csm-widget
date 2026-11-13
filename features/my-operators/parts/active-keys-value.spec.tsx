import { renderToStaticMarkup } from 'react-dom/server';
import { ActiveKeysValue } from './active-keys-value';

describe('ActiveKeysValue', () => {
  it('renders unspaced totals with a hidden reading', () => {
    const html = renderToStaticMarkup(
      <ActiveKeysValue active={10} total={15} />,
    );

    expect(html).toContain('10');
    expect(html).toContain('/15');
    expect(html).toContain('10 of 15');
  });

  it('renders spaced totals', () => {
    const html = renderToStaticMarkup(
      <ActiveKeysValue active={10} total={15} spaced />,
    );

    expect(html).toContain(' / 15');
  });
});
