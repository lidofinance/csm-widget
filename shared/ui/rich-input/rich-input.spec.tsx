import { renderToStaticMarkup } from 'react-dom/server';
import { RichInput } from './rich-input';

const getLabel = (html: string) =>
  html.match(/<label[^>]*>(.*?)<\/label>/)?.[1] ?? '';

describe('RichInput', () => {
  it('renders an editable input with Max and balance when not locked', () => {
    const html = renderToStaticMarkup(
      <RichInput
        label="stETH amount"
        balance="balance-slot"
        value="12"
        onChange={jest.fn()}
      />,
    );

    expect(html).not.toContain('readonly');
    expect(html).toContain('>Max<');
    expect(html).toContain('balance-slot');
    expect(getLabel(html)).not.toContain('<svg');
  });

  it('makes the input read-only and hides Max and balance when locked', () => {
    const html = renderToStaticMarkup(
      <RichInput
        locked
        label="stETH amount"
        balance="balance-slot"
        value="12"
        onChange={jest.fn()}
      />,
    );

    expect(html).toMatch(/<input[^>]*readonly=""/);
    expect(html).not.toContain('>Max<');
    expect(html).not.toContain('balance-slot');
  });

  it('adds a decorative lock icon inside the label when locked', () => {
    const label = getLabel(
      renderToStaticMarkup(
        <RichInput locked label="stETH amount" value="12" readOnly />,
      ),
    );

    expect(label).toContain('stETH amount');
    expect(label).toMatch(/<svg[^>]*aria-hidden="true"/);
  });

  it('renders no label and no lock icon when locked without a label', () => {
    const html = renderToStaticMarkup(<RichInput locked value="12" readOnly />);

    expect(html).not.toContain('<label');
    expect(html).not.toContain('<svg');
  });

  it('keeps the error text and input props when locked', () => {
    const html = renderToStaticMarkup(
      <RichInput
        locked
        error
        errorText="Not enough stETH"
        name="bondAmount"
        value="12"
        dataTestId={{ input: 'amountInput' }}
        readOnly
      />,
    );

    expect(html).toContain('Not enough stETH');
    expect(html).toMatch(/<input[^>]*name="bondAmount"/);
    expect(html).toMatch(/<input[^>]*data-testid="amountInput"/);
    expect(html).toMatch(/<input[^>]*aria-invalid="true"/);
  });
});
