import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { AddressField, AddressFieldProps } from './address-field';

vi.mock('shared/hooks/use-ens-input', () => ({
  useEnsInput: ({ value }: { value?: string }) => ({
    inputValue: value ?? '',
    address: value || undefined,
    ensName: undefined,
    isEns: false,
    isLoading: false,
    onInputChange: () => undefined,
  }),
}));

type Values = { address: string };

const ADDRESS = '0xc0ffee254729296a45a3885639AC7E10F9d54979';

const invalid: FieldErrors<Values> = {
  address: { type: 'VALIDATE', message: 'Address is not valid' },
};

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const render = (
  props: Partial<AddressFieldProps> = {},
  address = ADDRESS,
  errors?: FieldErrors<Values>,
) =>
  renderToStaticMarkup(
    <Host values={{ address }} errors={errors}>
      <AddressField name="address" label="New Manager Address" {...props} />
    </Host>,
  );

const input = (html: string) => html.match(/<input[^>]*>/)?.[0] ?? '';

describe('AddressField', () => {
  it('renders the named input with the identicon and the connected button', () => {
    const html = render({ currentAddress: ADDRESS });

    expect(input(html)).toContain('name="address"');
    expect(input(html)).toContain(`value="${ADDRESS}"`);
    expect(input(html)).toContain('placeholder="Ethereum address or ENS name"');
    expect(html).toContain('Identicon-module_root');
    expect(html).toContain('>Connected address</button>');
  });

  it('is read-only without the connected button when locked', () => {
    const html = render({ currentAddress: ADDRESS, locked: true });

    expect(input(html)).toContain('readonly=""');
    expect(html).not.toContain('Connected address');
  });

  it('renders trailing content in place of the identicon', () => {
    const html = render({
      locked: true,
      trailing: <span data-testid="connectedWalletTag">Connected wallet</span>,
    });

    expect(html).toContain('data-testid="connectedWalletTag"');
    expect(html).not.toContain('Identicon-module_root');
  });

  it('renders no identicon when simple', () => {
    expect(render({ simple: true })).not.toContain('Identicon-module_root');
  });

  it('renders the resolver error with the field error testid', () => {
    const html = render({}, 'bad', invalid);

    expect(input(html)).toContain('aria-invalid="true"');
    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Address is not valid');
  });

  it('highlights without a message when error is overridden', () => {
    const html = render({ error: true }, 'bad', invalid);

    expect(input(html)).toContain('aria-invalid="true"');
    expect(html).not.toContain('Address is not valid');
  });

  it('hides the field error when error is false', () => {
    const html = render({ error: false }, 'bad', invalid);

    expect(input(html)).not.toContain('aria-invalid');
    expect(html).not.toContain('inputMessageError');
  });
});
