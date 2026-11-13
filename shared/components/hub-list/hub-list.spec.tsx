import { renderToStaticMarkup } from 'react-dom/server';
import { HubList } from './hub-list';

describe('HubList', () => {
  it('renders the footer after the last row without a separator', () => {
    const html = renderToStaticMarkup(
      <HubList footer={<b>FOOTER</b>}>
        <i>ROW</i>
      </HubList>,
    );

    expect(html.indexOf('FOOTER')).toBeGreaterThan(html.indexOf('ROW'));
    expect(html).not.toContain('role="separator"');
  });

  it('omits the footer wrapper without a footer', () => {
    const html = renderToStaticMarkup(
      <HubList>
        <i>ROW</i>
        <i>ROW2</i>
      </HubList>,
    );

    expect(html).toContain('role="separator"');
    expect(html).not.toContain('FOOTER');
  });
});
