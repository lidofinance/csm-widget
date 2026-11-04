import { themeLight } from '@lidofinance/lido-ui';
import { PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { ThemeProvider } from 'styled-components';
import { TxStageMembersInitFailed } from './tx-stage-members-init-failed';

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

const render = (ui: FormUi) =>
  renderToStaticMarkup(
    <ThemeProvider theme={themeLight}>
      <FormUiProvider value={ui}>
        <TxStageMembersInitFailed
          title="IDVTC type claimed — cluster members not initialized"
          onRetry={jest.fn()}
        />
      </FormUiProvider>
    </ThemeProvider>,
  );

describe('TxStageMembersInitFailed', () => {
  it('renders app-ui retry and link in the app modal', () => {
    const footer =
      render('app').match(/data-testid="footer"[\s\S]*$/)?.[0] ?? '';

    expect(footer).toContain('>Retry</span>');
    expect(footer).toMatch(
      /<a class="TextLink-module_link[^"]*" href="\/idvtc\/members">Manage cluster members<\/a>/,
    );
    expect(footer).not.toContain('legacyLink');
  });

  it('keeps the lido-ui button and local link in legacy ui', () => {
    const html = render('legacy');

    expect(html).toContain('data-testid="legacyLink"');
    expect(html).not.toContain('Button-module');
  });
});
