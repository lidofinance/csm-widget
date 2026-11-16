import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormProvider, useForm } from 'react-hook-form';
import { SwitchField } from './switch-field';

type Values = { enabled: boolean };

const Host: FC<PropsWithChildren<{ values: Values }>> = ({
  values,
  children,
}) => {
  const methods = useForm<Values>({ defaultValues: values });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const render = (values: Values, disabled?: boolean) =>
  renderToStaticMarkup(
    <Host values={values}>
      <SwitchField
        name="enabled"
        label="Top-up allocation"
        disabled={disabled}
        submitOnChange
        dataTestId={{ input: 'topUpSwitch' }}
      />
    </Host>,
  );

const input = (html: string) => html.match(/<input[^>]*>/)?.[0] ?? '';

describe('SwitchField', () => {
  it('renders a named switch input checked from the value', () => {
    const tag = input(render({ enabled: true }));

    expect(tag).toContain('type="checkbox"');
    expect(tag).toContain('role="switch"');
    expect(tag).toContain('name="enabled"');
    expect(tag).toContain('data-testid="topUpSwitch"');
    expect(tag).toContain('checked=""');
  });

  it('is unchecked for a false value', () => {
    expect(input(render({ enabled: false }))).not.toContain('checked');
  });

  it('passes the label and disabled state', () => {
    const html = render({ enabled: true }, true);

    expect(html).toContain('>Top-up allocation</span>');
    expect(input(html)).toContain('disabled=""');
  });
});
