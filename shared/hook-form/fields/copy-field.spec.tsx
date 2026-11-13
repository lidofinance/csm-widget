import { renderToStaticMarkup } from 'react-dom/server';
import { CopyField } from './copy-field';

describe('CopyField', () => {
  it('renders a read-only input with a Copy tag-button', () => {
    const html = renderToStaticMarkup(
      <CopyField name="message" label="Message" text="sign me" />,
    );

    expect(html).toContain('value="sign me"');
    expect(html).toContain('readonly');
    expect(html).toContain('data-testid="copyBtn"');
    expect(html).toContain('role="button"');
    expect(html).toContain('Copy');
  });

  it('keeps the Copy tag-button out of an aria-hidden slot', () => {
    const html = renderToStaticMarkup(
      <CopyField name="message" label="Message" text="sign me" />,
    );

    expect(html).not.toMatch(
      /<span[^>]*aria-hidden="true"[^>]*>(?:(?!<\/span>).)*copyBtn/,
    );
  });
});
