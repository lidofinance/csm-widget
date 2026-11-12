import { renderToStaticMarkup } from 'react-dom/server';
import { DeleteKeysLayout } from './delete-keys-layout';

vi.mock('./delete-mode-cards', () => ({
  DeleteModeCards: () => <nav data-testid="cardsStub" />,
}));

describe('DeleteKeysLayout', () => {
  it('renders the cards above the main content and the aside after it', () => {
    const html = renderToStaticMarkup(
      <DeleteKeysLayout aside={<span>aside-slot</span>}>
        <span>main-slot</span>
      </DeleteKeysLayout>,
    );

    expect(html.indexOf('cardsStub')).toBeLessThan(html.indexOf('main-slot'));
    expect(html.indexOf('main-slot')).toBeLessThan(html.indexOf('aside-slot'));
  });

  it('renders an empty aside when none is given', () => {
    const html = renderToStaticMarkup(
      <DeleteKeysLayout>
        <span>notice</span>
      </DeleteKeysLayout>,
    );

    expect(html).toMatch(/<aside[^>]*>.*data-testid="emptyAside"/);
  });

  it('puts the testid on the layout root, not on a form', () => {
    const html = renderToStaticMarkup(
      <DeleteKeysLayout data-testid="removeKeysForm">
        <span>notice</span>
      </DeleteKeysLayout>,
    );

    expect(html).toContain('data-testid="removeKeysForm"');
    expect(html).not.toContain('<form');
  });
});
