import { renderToStaticMarkup } from 'react-dom/server';
import { Disclosure, type DisclosureProps } from './disclosure';

const render = (props: Omit<DisclosureProps, 'label'> = {}) =>
  renderToStaticMarkup(
    <Disclosure
      label="Specify custom addresses"
      data-testid="customAddressesDisclosure"
      {...props}
    >
      <span>Inner field</span>
    </Disclosure>,
  );

describe('Disclosure', () => {
  it('is closed by default and shows the label', () => {
    const html = render();
    expect(html).toContain('Specify custom addresses');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('Inner field');
  });

  it('opens initially with defaultOpen', () => {
    const html = render({ defaultOpen: true });
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('Inner field');
  });

  it('follows the controlled open prop over defaultOpen', () => {
    expect(render({ open: false, defaultOpen: true })).not.toContain(
      'Inner field',
    );
    expect(render({ open: true })).toContain('Inner field');
  });

  it('links the header to the content', () => {
    const html = render({ open: true });
    const id = html.match(/aria-controls="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`id="${id}"`);
  });

  it('forwards root attributes and never submits a form', () => {
    const html = render();
    expect(html).toContain('data-testid="customAddressesDisclosure"');
    expect(html).toMatch(/<button[^>]*type="button"/);
  });
});
