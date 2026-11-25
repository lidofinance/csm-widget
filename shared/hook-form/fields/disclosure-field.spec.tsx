import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { DisclosureField, hasAnyFieldError } from './disclosure-field';

type Values = {
  specifyCustomAddresses: boolean;
  rewardsAddress: string;
  managerAddress: string;
};

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const closed: Values = {
  specifyCustomAddresses: false,
  rewardsAddress: '',
  managerAddress: '',
};

const addressError: FieldErrors<Values> = {
  managerAddress: { type: 'VALIDATE', message: 'Enter a valid address' },
};

const render = (values: Values, errors?: FieldErrors<Values>) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <DisclosureField
        name="specifyCustomAddresses"
        label="Specify custom addresses"
        openLabel="Do not specify custom addresses"
        dependentFields={['rewardsAddress', 'managerAddress']}
        data-testid="customAddressesDisclosure"
      >
        <span>Inner fields</span>
      </DisclosureField>
    </Host>,
  );

describe('hasAnyFieldError', () => {
  it('finds an error on any listed name, nested names included', () => {
    expect(hasAnyFieldError(addressError, ['rewardsAddress'])).toBe(false);
    expect(
      hasAnyFieldError(addressError, ['rewardsAddress', 'managerAddress']),
    ).toBe(true);
    expect(hasAnyFieldError({ a: { b: { type: 'VALIDATE' } } }, ['a.b'])).toBe(
      true,
    );
  });

  it('is false without names', () => {
    expect(hasAnyFieldError(addressError)).toBe(false);
  });
});

describe('DisclosureField', () => {
  it('is closed while the field is false', () => {
    const html = render(closed);

    expect(html).toContain('Specify custom addresses');
    expect(html).not.toContain('Do not specify custom addresses');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('Inner fields');
  });

  it('opens when the field is true', () => {
    const html = render({ ...closed, specifyCustomAddresses: true });

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('Inner fields');
    expect(html).toContain('Do not specify custom addresses');
  });

  it('opens while a dependent field has an error', () => {
    expect(render(closed, addressError)).toContain('Inner fields');
  });

  it('forwards the testid and never submits the form', () => {
    const html = render(closed);

    expect(html).toContain('data-testid="customAddressesDisclosure"');
    expect(html).toMatch(/<button[^>]*type="button"/);
  });
});
