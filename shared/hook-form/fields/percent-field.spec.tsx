import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { PercentField, PercentFieldProps } from './percent-field';

type Values = { share?: bigint | null };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const tooMuch: FieldErrors<Values> = {
  share: { type: 'VALIDATE', message: 'Total share exceeds 100%' },
};

const render = (
  values: Values,
  props: Partial<PercentFieldProps> = {},
  errors?: FieldErrors<Values>,
) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <PercentField name="share" label="Share, %" {...props} />
    </Host>,
  );

const input = (html: string) => html.match(/<input[^>]*>/)?.[0] ?? '';

describe('PercentField', () => {
  it('renders basis points as percent text with a % suffix', () => {
    const html = render({ share: 1250n }, { 'data-testid': 'shareInput' });

    expect(input(html)).toContain('name="share"');
    expect(input(html)).toContain('value="12.50"');
    expect(input(html)).toContain('inputMode="decimal"');
    expect(input(html)).toContain('placeholder="0.00"');
    expect(input(html)).toContain('data-testid="shareInput"');
    expect(html).toContain('>%</span>');
    expect(html).toContain('>Share, %</label>');
  });

  it('renders an empty input without a value', () => {
    expect(input(render({ share: null }))).toContain('value=""');
  });

  it('renders the resolver error with the field error testid', () => {
    const html = render({ share: 9000n }, {}, tooMuch);

    expect(input(html)).toContain('aria-invalid="true"');
    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Total share exceeds 100%');
  });

  it('highlights without a message when error is overridden', () => {
    const html = render({ share: 9000n }, { error: true }, tooMuch);

    expect(input(html)).toContain('aria-invalid="true"');
    expect(html).not.toContain('Total share exceeds 100%');
  });
});
