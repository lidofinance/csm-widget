import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { parseEther } from 'viem';
import { AmountField, AmountFieldProps } from './amount-field';

type Values = { bondAmount?: bigint };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const render = (
  values: Values,
  props: Partial<AmountFieldProps> = {},
  errors?: FieldErrors<Values>,
) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <AmountField
        name="bondAmount"
        label="stETH amount"
        token="stETH"
        {...props}
      />
    </Host>,
  );

const input = (html: string) => html.match(/<input[^>]*>/)?.[0] ?? '';

describe('AmountField', () => {
  it('renders the value as plain ether text on the e2e testid', () => {
    const tag = input(
      render({ bondAmount: parseEther('2.4') }, { locked: true }),
    );

    expect(tag).toContain('data-testid="amountInput"');
    expect(tag).toContain('name="bondAmount"');
    expect(tag).toContain('value="2.4"');
  });

  it('is read-only with a lock icon when locked', () => {
    const html = render({ bondAmount: parseEther('2.4') }, { locked: true });

    const label = html.match(/<label[^>]*>[\s\S]*?<\/label>/)?.[0] ?? '';

    expect(input(html)).toContain('readonly=""');
    expect(label).toContain('stETH amount');
    expect(label).toMatch(/<svg[^>]*aria-hidden="true"/);
  });

  it('is editable when not locked', () => {
    expect(input(render({ bondAmount: parseEther('1') }))).not.toContain(
      'readonly',
    );
  });

  it('renders an empty input without a value', () => {
    expect(input(render({}, { locked: true }))).toContain('value=""');
  });

  it('shows the token on the right', () => {
    expect(render({ bondAmount: 1n }, { token: 'wstETH' })).toContain(
      '>wstETH</span>',
    );
  });

  it('renders the resolver error with the field error testid', () => {
    const html = render(
      { bondAmount: parseEther('12') },
      { locked: true },
      {
        bondAmount: {
          type: 'VALIDATE',
          message: 'Not enough stETH',
        },
      },
    );

    expect(input(html)).toContain('aria-invalid="true"');
    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Not enough stETH');
  });
});
