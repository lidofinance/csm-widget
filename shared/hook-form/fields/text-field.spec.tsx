import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { TextField } from './text-field';

type Values = { name: string };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const tooLong: FieldErrors<Values> = {
  name: { type: 'VALIDATE', message: 'Must be 64 characters or less' },
};

describe('TextField', () => {
  it('renders the named input with label, placeholder and hint', () => {
    const html = renderToStaticMarkup(
      <Host values={{ name: 'Lido' }}>
        <TextField
          name="name"
          label="Name"
          placeholder="Node Operator Name"
          description="This name will be publicly visible on-chain. You can update it later."
        />
      </Host>,
    );

    expect(html).toContain('name="name"');
    expect(html).toContain('value="Lido"');
    expect(html).toContain('placeholder="Node Operator Name"');
    expect(html).toContain('>Name</label>');
    expect(html).toContain(
      'This name will be publicly visible on-chain. You can update it later.',
    );
    expect(html).not.toContain('inputMessageError');
  });

  it('shows the resolver error with the e2e testid once the field has a value', () => {
    const html = renderToStaticMarkup(
      <Host values={{ name: 'x'.repeat(65) }} errors={tooLong}>
        <TextField name="name" label="Name" />
      </Host>,
    );

    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('>Must be 64 characters or less</p>');
    expect(html).toContain('aria-invalid="true"');
  });

  it('hides the error on a pristine empty field', () => {
    const html = renderToStaticMarkup(
      <Host values={{ name: '' }} errors={tooLong}>
        <TextField name="name" label="Name" />
      </Host>,
    );

    expect(html).not.toContain('inputMessageError');
    expect(html).not.toContain('aria-invalid');
  });

  it('shows the error on a pristine field with showUntouched', () => {
    const html = renderToStaticMarkup(
      <Host values={{ name: '' }} errors={tooLong}>
        <TextField name="name" label="Name" showUntouched />
      </Host>,
    );

    expect(html).toContain('data-testid="inputMessageError"');
  });
});
