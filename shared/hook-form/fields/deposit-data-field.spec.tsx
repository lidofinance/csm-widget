import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { DepositDataField, DepositDataFieldProps } from './deposit-data-field';

const mockWcTypeMismatch = jest.fn(() => false);

// The real barrel pulls modules/web3 and the SDK, which jest can't load
jest.mock('../deposit-data', () => ({
  useParseDepositData: jest.fn(),
  useIsWcTypeMismatch: () => mockWcTypeMismatch(),
  WcTypeWarning: () => <div data-testid="wcTypeWarning" />,
  DepositDataParsed: () => <div data-testid="parsedStub" />,
  DepositDataParameters: () => <div data-testid="parametersStub" />,
}));

type Values = {
  rawDepositData: string;
  depositData: { pubkey: string }[];
  confirmKeysReady: boolean;
};

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const empty: Values = {
  rawDepositData: '',
  depositData: [],
  confirmKeysReady: false,
};

const render = (
  values: Values = empty,
  props: DepositDataFieldProps = {},
  errors?: FieldErrors<Values>,
) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <DepositDataField {...props} />
    </Host>,
  );

const tag = (html: string, pattern: RegExp) => html.match(pattern)?.[0] ?? '';

describe('DepositDataField', () => {
  beforeEach(() => mockWcTypeMismatch.mockReturnValue(false));

  it('renders the e2e textarea on the JSON tab', () => {
    const textarea = tag(
      render({ ...empty, rawDepositData: '[{"pubkey":"0x1"}]' }),
      /<textarea[^>]*>/,
    );

    expect(textarea).toContain('name="rawDepositData"');
  });

  it('renders the title row with its action', () => {
    const html = render(empty, {
      label: 'Upload deposit data',
      action: <a href="#learn">Learn more</a>,
    });

    expect(html).toContain('>Upload deposit data</p>');
    expect(html).toContain('Learn more</a>');
  });

  it('shows the single-line placeholder by default', () => {
    const html = render();

    expect(html).toContain(
      'Paste JSON with deposit data or drag and drop the file<',
    );
    expect(html).not.toContain('key generation guide');
  });

  it('adds the key generation guide note on request', () => {
    const html = render(empty, { showGuideNote: true });

    expect(html).toContain(
      'Paste JSON with deposit data or drag and drop the file.<',
    );
    expect(html).toContain(
      'Please make sure you followed the key generation guide provided in FAQ.',
    );
  });

  it('disables the Parsed and Parameters tabs without keys', () => {
    const html = render();

    expect(
      tag(html, /<button[^>]*data-testid="tab-button-Parsed"[^>]*>/),
    ).toContain('disabled=""');
    expect(html).not.toContain('parsedStub');
  });

  it('renders the parse error with the deposit-data testid', () => {
    const html = render(
      empty,
      {},
      {
        rawDepositData: { type: 'VALIDATE', message: 'Invalid deposit data' },
      },
    );

    expect(html).toContain(
      '<span data-testid="input-message-error">Invalid deposit data</span>',
    );
    expect(tag(html, /<textarea[^>]*>/)).toContain('aria-invalid="true"');
  });

  it('swaps the error text for the withdrawal credentials warning', () => {
    mockWcTypeMismatch.mockReturnValue(true);
    const html = render(
      empty,
      {},
      {
        rawDepositData: { type: 'VALIDATE', message: 'Invalid deposit data' },
      },
    );

    expect(html).toContain('data-testid="wcTypeWarning"');
    expect(html).not.toContain('input-message-error');
    expect(tag(html, /<textarea[^>]*>/)).toContain('aria-invalid="true"');
  });

  it('renders nothing extra while valid', () => {
    const html = render();

    expect(html).not.toContain('input-message-error');
    expect(html).not.toContain('wcTypeWarning');
    expect(html).not.toContain('aria-invalid');
  });
});
