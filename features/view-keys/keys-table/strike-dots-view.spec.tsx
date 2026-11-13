import { renderToStaticMarkup } from 'react-dom/server';
import { StrikeDotsView } from './strike-dots-view';

describe('StrikeDotsView', () => {
  it('renders threshold dots with the filled ones marked', () => {
    const html = renderToStaticMarkup(
      <StrikeDotsView
        count={2}
        filled={2}
        threshold={3}
        lastStrikeIndex={undefined}
      />,
    );
    expect(html.match(/data-filled="true"/g)).toHaveLength(2);
    expect(html.match(/data-filled="false"/g)).toHaveLength(1);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="2/3 strikes"');
  });

  it('keeps the label on the dots when wrapped in a tooltip', () => {
    const html = renderToStaticMarkup(
      <StrikeDotsView
        count={1}
        filled={1}
        threshold={3}
        lastStrikeIndex={0}
        lastStrikeDate={1700000000}
      />,
    );
    expect(html).toContain('aria-label="1/3 strikes"');
    expect(html).toContain('role="img"');
  });
});
