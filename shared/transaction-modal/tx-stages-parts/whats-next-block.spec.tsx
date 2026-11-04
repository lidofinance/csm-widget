import { themeLight } from '@lidofinance/lido-ui';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { ThemeProvider } from 'styled-components';
import { WhatsNextBlock } from './whats-next-block';

const render = (ui: FormUi) =>
  renderToStaticMarkup(
    <ThemeProvider theme={themeLight}>
      <FormUiProvider value={ui}>
        <WhatsNextBlock>
          <li>STEP ONE</li>
          <li>STEP TWO</li>
        </WhatsNextBlock>
      </FormUiProvider>
    </ThemeProvider>,
  );

describe('WhatsNextBlock', () => {
  it('renders an app-ui message box with the steps in app ui', () => {
    const html = render('app');

    expect(html).toContain('MessageBox-module_box');
    expect(html).toContain('What is next:');
    expect(html).toContain('<ol><li>STEP ONE</li><li>STEP TWO</li></ol>');
    expect(html).not.toContain('<b>');
  });

  it('keeps the legacy block in legacy ui', () => {
    const html = render('legacy');

    expect(html).not.toContain('MessageBox-module');
    expect(html).toContain('<b>What is next: </b><br/><ol>');
  });
});
