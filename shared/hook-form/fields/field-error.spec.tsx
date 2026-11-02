import { renderToStaticMarkup } from 'react-dom/server';
import { FieldError } from './field-error';

describe('FieldError', () => {
  it('renders the message as an alert with the e2e testid', () => {
    const html = renderToStaticMarkup(
      <FieldError id="err-1">
        Please confirm that the keys are ready
      </FieldError>,
    );

    expect(html.startsWith('<p ')).toBe(true);
    expect(html).toContain('role="alert"');
    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('id="err-1"');
    expect(html).toContain('>Please confirm that the keys are ready</p>');
  });

  it('accepts a custom testid', () => {
    const html = renderToStaticMarkup(
      <FieldError data-testid="input-message-error">Invalid JSON</FieldError>,
    );

    expect(html).toContain('data-testid="input-message-error"');
    expect(html).not.toContain('inputMessageError');
  });

  it.each([undefined, '', false])('renders nothing for %p', (message) => {
    expect(renderToStaticMarkup(<FieldError>{message}</FieldError>)).toBe('');
  });
});
