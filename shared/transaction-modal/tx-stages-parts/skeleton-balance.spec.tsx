import { themeLight } from '@lidofinance/lido-ui';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { ThemeProvider } from 'styled-components';
import { SkeletonBalance } from './skeleton-balance';

const render = (ui: FormUi) =>
  renderToStaticMarkup(
    <ThemeProvider theme={themeLight}>
      <FormUiProvider value={ui}>
        <SkeletonBalance />
      </FormUiProvider>
    </ThemeProvider>,
  );

describe('SkeletonBalance', () => {
  it('renders the app-ui skeleton in app ui', () => {
    expect(render('app')).toContain('Skeleton-module_text');
  });

  it('renders the lido-ui loader in legacy ui', () => {
    expect(render('legacy')).not.toContain('Skeleton-module');
  });
});
