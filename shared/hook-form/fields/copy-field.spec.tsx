import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormProvider, useForm } from 'react-hook-form';
import { CopyField } from './copy-field';

const Host: FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm({ defaultValues: { message: 'sign me' } });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('CopyField', () => {
  it('renders a read-only input with a Copy tag-button', () => {
    const html = renderToStaticMarkup(
      <Host>
        <CopyField name="message" label="Message" text="sign me" />
      </Host>,
    );

    expect(html).toContain('value="sign me"');
    expect(html).toContain('readonly');
    expect(html).toContain('data-testid="copyBtn"');
    expect(html).toContain('role="button"');
    expect(html).toContain('Copy');
  });
});
