import { renderToStaticMarkup } from 'react-dom/server';
import { DeleteKeysLayout } from './delete-keys-layout';
import type { DeleteKeysSwitcherRoutes } from './delete-keys-switcher';

jest.mock('./delete-keys-switcher', () => ({
  DeleteKeysSwitcher: ({ active }: { active: string }) => (
    <nav data-testid="switcherStub" data-active={active} />
  ),
}));

const REMOVE = 'REMOVE' as DeleteKeysSwitcherRoutes;

describe('DeleteKeysLayout', () => {
  it('renders the switcher above the main content and the aside after it', () => {
    const html = renderToStaticMarkup(
      <DeleteKeysLayout active={REMOVE} aside={<span>aside-slot</span>}>
        <span>main-slot</span>
      </DeleteKeysLayout>,
    );

    expect(html).toContain('data-active="REMOVE"');
    expect(html.indexOf('switcherStub')).toBeLessThan(
      html.indexOf('main-slot'),
    );
    expect(html.indexOf('main-slot')).toBeLessThan(html.indexOf('aside-slot'));
  });

  it('puts the testid on the card root and keeps an empty aside column', () => {
    const html = renderToStaticMarkup(
      <DeleteKeysLayout
        active={REMOVE}
        aside={null}
        data-testid="removeKeysForm"
      >
        <span>notice</span>
      </DeleteKeysLayout>,
    );

    expect(html).toMatch(/^<div[^>]*data-testid="removeKeysForm"/);
    expect(html).toMatch(/<div[^>]*><div[^>]*><\/div><\/div><\/div>$/);
    expect(html).not.toContain('<form');
  });
});
