import { FC, PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormProvider, useForm } from 'react-hook-form';
import { FormDataContext } from 'shared/hook-form/form-controller/form-data-context';
import { FormMainAsideSkeleton, FormReady } from './form-ready';

type HostProps = PropsWithChildren<{
  isPending: boolean;
  asyncDefaults?: boolean;
}>;

const Host: FC<HostProps> = ({ isPending, asyncDefaults, children }) => {
  const form = useForm<{ name: string }>({
    defaultValues: asyncDefaults ? async () => ({ name: '' }) : { name: '' },
  });
  const data = isPending
    ? { data: {}, isPending: true as const, revalidate: () => undefined }
    : { data: {}, isPending: false as const, revalidate: () => undefined };
  return (
    <FormDataContext.Provider value={data}>
      <FormProvider {...form}>{children}</FormProvider>
    </FormDataContext.Provider>
  );
};

const renderReady = (props: Omit<HostProps, 'children'>) =>
  renderToStaticMarkup(
    <Host {...props}>
      <FormReady>
        <i>FORM</i>
      </FormReady>
    </Host>,
  );

it('renders the skeleton while form data is pending', () => {
  const html = renderReady({ isPending: true });
  expect(html).toContain('data-testid="formSkeleton"');
  expect(html).toContain('role="status"');
  expect(html).not.toContain('FORM');
});

it('renders the skeleton while async default values load', () => {
  const html = renderReady({ isPending: false, asyncDefaults: true });
  expect(html).toContain('data-testid="formSkeleton"');
  expect(html).not.toContain('FORM');
});

it('renders children once loaded', () => {
  const html = renderReady({ isPending: false });
  expect(html).toContain('FORM');
  expect(html).not.toContain('formSkeleton');
});

it('renders the main+aside skeleton with an aside landmark', () => {
  const html = renderToStaticMarkup(<FormMainAsideSkeleton />);
  expect(html).toContain('data-testid="formSkeleton"');
  expect(html).toContain('<aside');
});

it('renders a custom skeleton while pending', () => {
  const html = renderToStaticMarkup(
    <Host isPending>
      <FormReady skeleton={<b>CUSTOM</b>}>
        <i>FORM</i>
      </FormReady>
    </Host>,
  );
  expect(html).toContain('CUSTOM');
  expect(html).not.toContain('FORM');
});
