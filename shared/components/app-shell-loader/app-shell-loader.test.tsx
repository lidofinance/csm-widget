import { renderToStaticMarkup } from 'react-dom/server';
import { WIDGET_DESCRIPTION, WIDGET_TITLE } from 'consts/module';
import { AppShellLoader } from './app-shell-loader';

describe('AppShellLoader', () => {
  it('renders branded content without providers', () => {
    const html = renderToStaticMarkup(<AppShellLoader />);
    expect(html).toContain(WIDGET_TITLE);
    expect(html).toContain(WIDGET_DESCRIPTION);
    expect(html).not.toContain('data-testid');
  });
});
