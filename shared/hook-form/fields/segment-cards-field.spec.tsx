import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import {
  SegmentCardsField,
  SegmentCardsFieldOption,
} from './segment-cards-field';

type Values = { claimOption?: string };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const options: SegmentCardsFieldOption[] = [
  {
    value: 'all',
    title: 'Cash out',
    description: 'Description all',
    dataTestId: { root: 'claimOption-all' },
  },
  {
    value: 'bond',
    title: 'Excess bond only',
    disabled: true,
    dataTestId: { root: 'claimOption-bond' },
  },
];

const notAllowed: FieldErrors<Values> = {
  claimOption: { type: 'VALIDATE', message: 'Not allowed' },
};

const render = (
  values: Values,
  errors?: FieldErrors<Values>,
  showUntouched?: boolean,
) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <SegmentCardsField
        name="claimOption"
        options={options}
        aria-label="Select claiming option"
        showUntouched={showUntouched}
        data-testid="claimOptions"
      />
    </Host>,
  );

const tabs = (html: string) =>
  html.match(/<button[^>]*role="tab"[^>]*>/g) ?? [];

describe('SegmentCardsField', () => {
  it('renders a labelled tablist with the testid', () => {
    const html = render({});
    const list = html.match(/<div[^>]*role="tablist"[^>]*>/)?.[0] ?? '';

    expect(list).toContain('aria-label="Select claiming option"');
    expect(list).toContain('data-testid="claimOptions"');
    expect(tabs(html)).toHaveLength(2);
  });

  it('selects the card of the field value', () => {
    const [all, bond] = tabs(render({ claimOption: 'all' }));

    expect(all).toContain('data-testid="claimOption-all"');
    expect(all).toContain('aria-selected="true"');
    expect(bond).toContain('aria-selected="false"');
    expect(bond).toContain('disabled');
  });

  it('renders card content', () => {
    expect(render({})).toContain('Description all');
  });

  it('renders the error for a chosen value and links it to the list', () => {
    const html = render({ claimOption: 'all' }, notAllowed);
    const list = html.match(/<div[^>]*role="tablist"[^>]*>/)?.[0] ?? '';
    const error =
      html.match(/<span[^>]*data-testid="inputMessageError"[^>]*>/)?.[0] ?? '';
    const errorId = error.match(/\sid="([^"]+)"/)?.[1];

    expect(errorId).toBeTruthy();
    expect(html).toContain('Not allowed');
    expect(list).toContain('aria-invalid="true"');
    expect(list).toContain(`aria-describedby="${errorId}"`);
  });

  it('hides the error on an untouched empty field unless showUntouched', () => {
    expect(render({}, notAllowed)).not.toContain('inputMessageError');
    expect(render({}, notAllowed, true)).toContain('inputMessageError');
  });
});
