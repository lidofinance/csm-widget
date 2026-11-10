import { renderToStaticMarkup } from 'react-dom/server';
import { PATH } from 'consts/urls';
import { HubRow, HubRowEmptyValue } from './hub-row';

jest.mock('shared/navigate/local-link', () => ({
  LocalLink: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('HubRow', () => {
  it('renders an anchor with a chevron when href is set', () => {
    const html = renderToStaticMarkup(
      <HubRow title="Roles" href={PATH.SETTINGS} dataTestId="row" />,
    );
    expect(html).toContain('<a ');
    expect(html).toContain('href="/settings"');
    expect(html).toContain('data-testid="row"');
    expect(html).toContain('<svg');
  });

  it('renders a plain row without anchor or chevron without href', () => {
    const html = renderToStaticMarkup(
      <HubRow title="Survey" trailing={<b>ACTION</b>} />,
    );
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<svg');
    expect(html).toContain('ACTION');
  });

  it('renders the empty value markup', () => {
    const html = renderToStaticMarkup(
      <HubRow title="Rewards claimer" value={<HubRowEmptyValue />} />,
    );
    expect(html).toContain('Not set');
  });
});
