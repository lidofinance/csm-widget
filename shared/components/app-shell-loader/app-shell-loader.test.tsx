import { renderToStaticMarkup } from 'react-dom/server';
import { moduleMeta } from 'consts/module';
import { AppShellLoader } from './app-shell-loader';

describe('AppShellLoader', () => {
  it('renders branded content without providers', () => {
    const html = renderToStaticMarkup(<AppShellLoader />);
    expect(html).toContain(moduleMeta.title);
    expect(html).toContain(moduleMeta.description);
    expect(html).not.toContain('data-testid');
  });
});
