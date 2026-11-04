import { themeLight } from '@lidofinance/lido-ui';
import { PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { ThemeProvider } from 'styled-components';
import { TxStageDkgUploadFailed } from './tx-stage-dkg-upload-failed';

jest.mock('shared/transaction-modal/tx-stages-basic/icons', () => ({
  StageIconLimit: () => null,
}));

jest.mock('shared/navigate', () => ({
  LocalLink: ({ href, children }: PropsWithChildren<{ href: string }>) => (
    <a data-testid="legacyLink" href={href}>
      {children}
    </a>
  ),
}));

jest.mock('shared/components', () => ({
  Stack: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const render = (ui: FormUi) =>
  renderToStaticMarkup(
    <ThemeProvider theme={themeLight}>
      <FormUiProvider value={ui}>
        <TxStageDkgUploadFailed nodeOperatorId={12n} onRetry={jest.fn()} />
      </FormUiProvider>
    </ThemeProvider>,
  );

describe('TxStageDkgUploadFailed', () => {
  it('renders app-ui retry and link in the app modal', () => {
    const footer =
      render('app').match(/data-testid="footer"[\s\S]*$/)?.[0] ?? '';

    expect(footer).toContain('Button-module_button');
    expect(footer).toContain('>Retry upload</span>');
    expect(footer).toMatch(
      /<a class="TextLink-module_link[^"]*" href="\/idvtc\/dkg">Manage DKG files<\/a>/,
    );
    expect(footer).not.toContain('legacyLink');
  });

  it('keeps the lido-ui buttons in legacy ui', () => {
    const html = render('legacy');

    expect(html).toContain('data-testid="legacyLink"');
    expect(html).not.toContain('Button-module');
  });
});
