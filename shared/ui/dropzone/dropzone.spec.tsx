import { renderToStaticMarkup } from 'react-dom/server';
import { Dropzone, type DropzoneProps } from './dropzone';

const PLACEHOLDER = 'Paste JSON with deposit data or drag and drop the file';

const render = (props: DropzoneProps = {}) =>
  renderToStaticMarkup(
    <Dropzone
      name="rawDepositData"
      accept=".json,application/json"
      placeholder={PLACEHOLDER}
      data-testid="depositDataDropzone"
      {...props}
    />,
  );

const tag = (html: string, pattern: RegExp) => html.match(pattern)?.[0] ?? '';

describe('Dropzone', () => {
  it('renders a named, labelled textarea', () => {
    const textarea = tag(render(), /<textarea[^>]*>/);
    expect(textarea).toContain('name="rawDepositData"');
    expect(textarea).toContain('aria-label="Paste or drop content"');
  });

  it('shows the placeholder only while empty', () => {
    expect(render({ value: '' })).toContain(PLACEHOLDER);
    expect(render({ value: '0xabc' })).not.toContain(PLACEHOLDER);
  });

  it('renders the current value in the textarea', () => {
    expect(render({ value: '0xabc' })).toMatch(/>0xabc<\/textarea>/);
  });

  it('renders a hidden file input with accept', () => {
    const input = tag(render(), /<input[^>]*type="file"[^>]*>/);
    expect(input).toContain('accept=".json,application/json"');
    expect(input).toContain('tabindex="-1"');
  });

  it('renders an error alert linked to the textarea', () => {
    const html = render({ error: 'Invalid JSON' });
    const alert = tag(html, /<p[^>]*role="alert"[^>]*>/);
    const id = alert.match(/id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain('Invalid JSON');
    const textarea = tag(html, /<textarea[^>]*>/);
    expect(textarea).toContain(`aria-describedby="${id}"`);
    expect(textarea).toContain('aria-invalid="true"');
  });

  it('highlights without an alert when error is true', () => {
    const html = render({ error: true });
    expect(html).not.toContain('role="alert"');
    expect(tag(html, /<textarea[^>]*>/)).toContain('aria-invalid="true"');
    expect(html).not.toContain('aria-describedby');
  });

  it('replaces the textarea with children', () => {
    const html = render({ children: <div data-testid="parsedKeys" /> });
    expect(html).toContain('data-testid="parsedKeys"');
    expect(html).not.toContain('<textarea');
  });

  it('renders tabs above the zone', () => {
    const html = render({
      tabs: {
        items: [
          { value: 'json', label: 'JSON' },
          { value: 'parsed', label: 'Parsed' },
        ],
        value: 'json',
        onChange: () => undefined,
      },
    });
    expect(html).toContain('role="tablist"');
    expect(html).toContain('Parsed');
  });

  it('disables the zone and the textarea', () => {
    const html = render({ disabled: true });
    const zone = tag(html, /<div[^>]*role="button"[^>]*>/);
    expect(zone).toContain('aria-disabled="true"');
    expect(zone).toContain('tabindex="-1"');
    expect(tag(html, /<textarea[^>]*>/)).toContain('disabled=""');
  });

  it('forwards data-testid to the root', () => {
    expect(render()).toContain('data-testid="depositDataDropzone"');
  });
});
