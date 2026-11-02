import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { CheckboxField } from './checkbox-field';

type Values = { confirmKeysReady: boolean };

const Host: FC<
  PropsWithChildren<{ values: Values; errors?: FieldErrors<Values> }>
> = ({ values, errors, children }) => {
  const methods = useForm<Values>({ defaultValues: values, errors });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const render = (values: Values, errors?: FieldErrors<Values>) =>
  renderToStaticMarkup(
    <Host values={values} errors={errors}>
      <CheckboxField name="confirmKeysReady" label="I confirm that:" />
    </Host>,
  );

const labelInner = (html: string) =>
  html.match(/<label[^>]*>([\s\S]*?)<\/label>/)?.[1] ?? '';

describe('CheckboxField', () => {
  it('wraps the named checkbox, its tick svg and the text in one label', () => {
    const inner = labelInner(render({ confirmKeysReady: false }));

    expect(inner).toContain('type="checkbox"');
    expect(inner).toContain('name="confirmKeysReady"');
    expect(inner).toContain('<svg');
    expect(inner).toContain('I confirm that:');
    expect(inner).not.toContain('checked=""');
  });

  it('reflects a true value as checked', () => {
    expect(labelInner(render({ confirmKeysReady: true }))).toContain(
      'checked=""',
    );
  });

  it('renders no error without one', () => {
    expect(render({ confirmKeysReady: false })).not.toContain(
      'inputMessageError',
    );
  });

  it('renders the resolver error after the label and marks the input invalid', () => {
    const html = render(
      { confirmKeysReady: false },
      {
        confirmKeysReady: {
          type: 'VALIDATE',
          message: 'Please confirm that the keys are ready',
        },
      },
    );
    const afterLabel = html.split('</label>')[1] ?? '';

    expect(labelInner(html)).toContain('aria-invalid="true"');
    expect(afterLabel).toContain('data-testid="inputMessageError"');
    expect(afterLabel).toContain('role="alert"');
    expect(afterLabel).toContain('Please confirm that the keys are ready');
  });
});
