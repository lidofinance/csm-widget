import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { SelectField } from './select-field';

type Values = { client: string };

const options = [
  { value: 'geth', label: 'Geth' },
  { value: 'nethermind', label: 'Nethermind' },
];

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('SelectField', () => {
  it('renders the default placeholder and label', () => {
    const html = renderToStaticMarkup(
      <Host values={{ client: '' }}>
        <SelectField name="client" label="Client" options={options} />
      </Host>,
    );

    expect(html).toContain('Select');
    expect(html).toContain('Client');
    expect(html).toContain('name="client"');
  });

  it('renders the selected option label', () => {
    const html = renderToStaticMarkup(
      <Host values={{ client: 'geth' }}>
        <SelectField name="client" label="Client" options={options} />
      </Host>,
    );

    expect(html).toContain('Geth');
  });

  it('shows the error message with the e2e testid', () => {
    const html = renderToStaticMarkup(
      <Host
        values={{ client: '' }}
        errors={{ client: { type: 'required', message: 'Field is required' } }}
      >
        <SelectField
          name="client"
          label="Client"
          options={options}
          showUntouched
        />
      </Host>,
    );

    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Field is required');
  });

  it('highlights without a message when the error has none', () => {
    const html = renderToStaticMarkup(
      <Host values={{ client: '' }} errors={{ client: { type: 'required' } }}>
        <SelectField
          name="client"
          label="Client"
          options={options}
          showUntouched
        />
      </Host>,
    );

    expect(html).toContain('aria-invalid="true"');
    expect(html).not.toContain('inputMessageError');
  });
});
