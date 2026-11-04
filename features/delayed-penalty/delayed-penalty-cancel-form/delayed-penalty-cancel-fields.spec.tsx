import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { parseEther } from 'viem';
import { DelayedPenaltyCancelFields } from './delayed-penalty-cancel-fields';

// the fields barrel pulls AddressField → wagmi (ESM), which jest can't load
jest.mock('shared/hook-form/fields', () => ({
  ...jest.requireActual('shared/hook-form/fields/text-field'),
  ...jest.requireActual('shared/hook-form/fields/amount-field'),
}));

type Values = {
  nodeOperatorId?: string;
  amount?: bigint | null;
  maxAmount?: bigint;
};

const Host: FC<
  PropsWithChildren<{ values?: Values; errors?: FieldErrors<Values> }>
> = ({ values = {}, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const render = (values?: Values, errors?: FieldErrors<Values>) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <DelayedPenaltyCancelFields />
    </Host>,
  );

const maxTag = (html: string) =>
  html.match(/<[^>]*data-testid="maxBtn"[^>]*>/)?.[0];

describe('DelayedPenaltyCancelFields', () => {
  it('renders the section titles and the input names e2e locates by', () => {
    const html = render();

    expect(html).toContain('>Specify Node Operator</p>');
    expect(html).toContain('>Enter cancellation amount</p>');
    expect(html).toContain('name="nodeOperatorId"');
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain('name="amount"');
    expect(html).toContain('data-testid="amountInput"');
    expect(html).toContain('>ETH amount</label>');
  });

  it('hides Max until the locked bond is known', () => {
    expect(maxTag(render())).toBeUndefined();
  });

  it('enables Max when the operator has locked bond', () => {
    const html = render({ maxAmount: parseEther('1') });
    const tag = maxTag(html);

    expect(tag).toContain('role="button"');
    expect(tag).not.toContain('aria-disabled');
    expect(html).toContain('>Max</span>');
  });

  it('disables Max when the locked bond is zero', () => {
    expect(maxTag(render({ maxAmount: 0n }))).toContain('aria-disabled="true"');
  });

  it('shows the amount error under the amount input', () => {
    const html = render(
      { amount: 0n },
      {
        amount: {
          type: 'VALIDATE',
          message: 'Enter ETH amount greater than 0',
        },
      },
    );

    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Enter ETH amount greater than 0');
  });
});
