import { themeLight } from '@lidofinance/lido-ui';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { ThemeProvider } from 'styled-components';
import { AfterAddressProposed } from './after-address-proposed';

jest.mock('shared/hooks/use-module-meta', () => ({
  useModuleMeta: () => ({ shortTitle: 'CSM' }),
}));

jest.mock('shared/components', () => ({
  Address: ({ address }: { address: string }) => (
    <span data-testid="legacyAddress">{address}</span>
  ),
}));

const ADDRESS = '0x81e5ca00000000000000000000000000000a23d7';

const render = (ui: FormUi) =>
  renderToStaticMarkup(
    <ThemeProvider theme={themeLight}>
      <FormUiProvider value={ui}>
        <AfterAddressProposed address={ADDRESS} />
      </FormUiProvider>
    </ThemeProvider>,
  );

describe('AfterAddressProposed', () => {
  it.each<FormUi>(['app', 'legacy'])('keeps the e2e copy in %s ui', (ui) => {
    const html = render(ui);

    expect(html).toContain('What is next:');
    expect(html).toContain('Connect to CSM UI with the proposed address');
    expect(html).toContain(
      'Go to Settings tab → Inbox requests to confirm the change',
    );
  });

  it('renders the app-ui address in app ui', () => {
    const html = render('app');

    expect(html).toContain('Address-module_root');
    expect(html).toContain('0x81e5ca...0a23d7');
    expect(html).not.toContain('legacyAddress');
  });

  it('renders the legacy address in legacy ui', () => {
    expect(render('legacy')).toContain('data-testid="legacyAddress"');
  });
});
