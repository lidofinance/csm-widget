import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { OptionCardsField, OptionCardsFieldOption } from './option-cards-field';

type Values = { gateName?: string };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const options: OptionCardsFieldOption[] = [
  {
    value: 'curatedGatePTO',
    title: 'Professional Trusted Operator',
    description: 'Description PTO',
    'data-testid': 'gateCardPTO',
    children: <span data-testid="gateCardBondParams">Bond:</span>,
  },
  {
    value: 'curatedGatePO',
    title: 'Professional Operator',
    'data-testid': 'gateCardPO',
    disabled: true,
  },
];

const notEligible: FieldErrors<Values> = {
  gateName: { type: 'VALIDATE', message: 'You are not eligible' },
};

const render = (
  values: Values,
  errors?: FieldErrors<Values>,
  showUntouched?: boolean,
) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <OptionCardsField
        name="gateName"
        options={options}
        aria-label="Sub-Node Operator type"
        showUntouched={showUntouched}
        data-testid="gateSelector"
      />
    </Host>,
  );

const radios = (html: string) =>
  html.match(/<div[^>]*role="radio"[^>]*>/g) ?? [];

describe('OptionCardsField', () => {
  it('renders a labelled radiogroup with the testid', () => {
    const html = render({});
    const group = html.match(/<div[^>]*role="radiogroup"[^>]*>/)?.[0] ?? '';

    expect(group).toContain('aria-label="Sub-Node Operator type"');
    expect(group).toContain('data-testid="gateSelector"');
    expect(radios(html)).toHaveLength(2);
  });

  it('checks the card of the field value', () => {
    const [pto, po] = radios(render({ gateName: 'curatedGatePTO' }));

    expect(pto).toContain('data-testid="gateCardPTO"');
    expect(pto).toContain('aria-checked="true"');
    expect(po).toContain('aria-checked="false"');
    expect(po).toContain('aria-disabled="true"');
  });

  it('checks nothing without a value', () => {
    radios(render({})).forEach((radio) => {
      expect(radio).toContain('aria-checked="false"');
    });
  });

  it('renders card content', () => {
    const html = render({});

    expect(html).toContain('Description PTO');
    expect(html).toContain('data-testid="gateCardBondParams"');
  });

  it('renders the error for a chosen value and links it to the group', () => {
    const html = render({ gateName: 'curatedGatePTO' }, notEligible);
    const group = html.match(/<div[^>]*role="radiogroup"[^>]*>/)?.[0] ?? '';
    const error =
      html.match(/<span[^>]*data-testid="inputMessageError"[^>]*>/)?.[0] ?? '';
    const errorId = error.match(/\sid="([^"]+)"/)?.[1];

    expect(errorId).toBeTruthy();
    expect(html).toContain('You are not eligible');
    expect(group).toContain('aria-invalid="true"');
    expect(group).toContain(`aria-describedby="${errorId}"`);
  });

  it('hides the error on an untouched empty field unless showUntouched', () => {
    expect(render({}, notEligible)).not.toContain('inputMessageError');
    expect(render({}, notEligible, true)).toContain('inputMessageError');
  });

  it('passes the horizontal orientation to the group', () => {
    const html = renderToStaticMarkup(
      <Host values={{ gateName: 'curatedGatePTO' }}>
        <OptionCardsField
          name="gateName"
          options={options}
          aria-label="Claiming option"
          orientation="horizontal"
        />
      </Host>,
    );

    expect(html).toMatch(
      /<div[^>]*role="radiogroup"[^>]*aria-orientation="horizontal"/,
    );
  });
});
