import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { DelayedPenaltyReportFields } from './delayed-penalty-report-fields';

// the fields barrel pulls AddressField → wagmi (ESM), which jest can't load
jest.mock('shared/hook-form/fields', () => ({
  ...jest.requireActual('shared/hook-form/fields/text-field'),
  ...jest.requireActual('shared/hook-form/fields/amount-field'),
}));

type Values = {
  nodeOperatorId?: string;
  amount?: bigint | null;
  penaltyType?: string;
  details?: string;
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
      <DelayedPenaltyReportFields />
    </Host>,
  );

describe('DelayedPenaltyReportFields', () => {
  it('renders the four section titles e2e asserts', () => {
    const html = render();

    expect(html).toContain('>Specify Node Operator</p>');
    expect(html).toContain('>Enter penalty amount</p>');
    expect(html).toContain('>Enter Penalty Type</p>');
    expect(html).toContain('>Enter Details</p>');
  });

  it('keeps the input names e2e locates by', () => {
    const html = render();

    expect(html).toContain('name="nodeOperatorId"');
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain('name="amount"');
    expect(html).toContain('data-testid="amountInput"');
    expect(html).toContain('name="penaltyType"');
    expect(html).toContain('placeholder="0x…"');
    expect(html).toContain('name="details"');
  });

  it('labels the amount in ETH without a Max button', () => {
    const html = render();

    expect(html).toContain('>ETH amount</label>');
    expect(html).not.toContain('data-testid="maxBtn"');
  });

  it('shows the penalty type error once the field has a value', () => {
    const html = render(
      { penaltyType: '0x0' },
      {
        penaltyType: {
          type: 'VALIDATE',
          message: 'Penalty type should not be zero',
        },
      },
    );

    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Penalty type should not be zero');
  });
});
