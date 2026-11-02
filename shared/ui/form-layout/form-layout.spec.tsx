import { renderToStaticMarkup } from 'react-dom/server';
import { FormLayout } from './form-layout';

describe('FormLayout', () => {
  it('renders main column then aside with a nested content column', () => {
    const html = renderToStaticMarkup(
      <FormLayout aside={<span>aside-slot</span>}>
        <span>main-slot</span>
      </FormLayout>,
    );

    expect(html).toMatch(
      /^<div[^>]*><div[^>]*><span>main-slot<\/span><\/div><div[^>]*><div[^>]*><span>aside-slot<\/span><\/div><\/div><\/div>$/,
    );
  });

  it('forwards html attributes and className to the root', () => {
    const html = renderToStaticMarkup(
      <FormLayout
        aside={null}
        id="layout"
        data-testid="submitKeysForm"
        className="extra"
      >
        main
      </FormLayout>,
    );

    expect(html).toMatch(/^<div[^>]*data-testid="submitKeysForm"/);
    expect(html).toMatch(/^<div[^>]*id="layout"/);
    expect(html).toMatch(/^<div[^>]*class="[^"]*\bextra\b/);
  });

  it('does not leak the aside prop to the DOM', () => {
    const html = renderToStaticMarkup(
      <FormLayout aside="aside-text">main</FormLayout>,
    );

    expect(html).not.toContain('aside=');
    expect(html).toContain('aside-text');
  });
});
