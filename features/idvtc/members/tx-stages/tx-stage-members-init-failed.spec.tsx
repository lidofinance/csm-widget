import { renderToStaticMarkup } from 'react-dom/server';
import { TxStageMembersInitFailed } from './tx-stage-members-init-failed';

const render = () =>
  renderToStaticMarkup(
    <TxStageMembersInitFailed
      title="IDVTC type claimed — cluster members not initialized"
      onRetry={vi.fn()}
    />,
  );

describe('TxStageMembersInitFailed', () => {
  it('renders app-ui retry and link', () => {
    const footer = render().match(/data-testid="footer"[\s\S]*$/)?.[0] ?? '';

    expect(footer).toContain('>Retry</span>');
    expect(footer).toMatch(
      /<a class="TextLink-module_link[^"]*" href="\/idvtc\/members">Manage cluster members<\/a>/,
    );
  });
});
