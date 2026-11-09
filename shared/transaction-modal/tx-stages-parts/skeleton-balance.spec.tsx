import { themeLight } from '@lidofinance/lido-ui';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from 'styled-components';
import { SkeletonBalance } from './skeleton-balance';

describe('SkeletonBalance', () => {
  it('renders the app-ui text skeleton', () => {
    const html = renderToStaticMarkup(
      <ThemeProvider theme={themeLight}>
        <SkeletonBalance />
      </ThemeProvider>,
    );

    expect(html).toContain('Skeleton-module_text');
  });
});
