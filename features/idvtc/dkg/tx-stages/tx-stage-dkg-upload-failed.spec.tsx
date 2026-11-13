import { renderToStaticMarkup } from 'react-dom/server';
import { TxStageDkgUploadFailed } from './tx-stage-dkg-upload-failed';

const render = () =>
  renderToStaticMarkup(
    <TxStageDkgUploadFailed nodeOperatorId={12n} onRetry={vi.fn()} />,
  );

describe('TxStageDkgUploadFailed', () => {
  it('renders app-ui retry and link', () => {
    const footer = render().match(/data-testid="footer"[\s\S]*$/)?.[0] ?? '';

    expect(footer).toContain('Button-module_button');
    expect(footer).toContain('>Retry upload</span>');
    expect(footer).toMatch(
      /<a class="TextLink-module_link[^"]*" href="\/idvtc\/dkg">Manage DKG files<\/a>/,
    );
  });
});
