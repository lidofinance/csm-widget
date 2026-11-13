import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormProvider, useForm } from 'react-hook-form';
import { NumberField } from './number-field';

type Values = { keys?: number };

const Host: FC<PropsWithChildren<{ values: Values }>> = ({
  values,
  children,
}) => {
  const methods = useForm<Values>({ defaultValues: values });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('NumberField', () => {
  it('renders a numeric input with label and placeholder', () => {
    const html = renderToStaticMarkup(
      <Host values={{ keys: 4 }}>
        <NumberField name="keys" label="Keys" placeholder="Number" />
      </Host>,
    );

    expect(html).toContain('name="keys"');
    expect(html).toContain('value="4"');
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain('placeholder="Number"');
    expect(html).toContain('>Keys</label>');
  });

  it('renders empty for no value', () => {
    const html = renderToStaticMarkup(
      <Host values={{}}>
        <NumberField name="keys" label="Keys" />
      </Host>,
    );

    expect(html).toContain('value=""');
  });

  it('shows the range message once the value is out of range', () => {
    const html = renderToStaticMarkup(
      <Host values={{ keys: 9 }}>
        <NumberField
          name="keys"
          label="Keys"
          max={7}
          maxMessage="Maximum keys amount is 7"
        />
      </Host>,
    );

    expect(html).toContain('data-testid="inputMessageError"');
    expect(html).toContain('Maximum keys amount is 7');
  });

  it('renders the trailing node', () => {
    const html = renderToStaticMarkup(
      <Host values={{ keys: 1 }}>
        <NumberField name="keys" label="Keys" trailing={<b>7 keys left</b>} />
      </Host>,
    );

    expect(html).toContain('<b>7 keys left</b>');
  });
});
