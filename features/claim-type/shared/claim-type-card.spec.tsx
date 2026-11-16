import { renderToStaticMarkup } from 'react-dom/server';
import { ClaimTypeCard } from './claim-type-card';

describe('ClaimTypeCard', () => {
  it('renders badges, title, description and then the children', () => {
    const html = renderToStaticMarkup(
      <ClaimTypeCard
        badges={<i>BADGES</i>}
        title="TITLE"
        titleTestId="formTitle"
        description="DESCRIPTION"
        data-testid="claimCard"
      >
        <b>CTA</b>
      </ClaimTypeCard>,
    );

    const order = ['BADGES', 'TITLE', 'DESCRIPTION', 'CTA'].map((part) =>
      html.indexOf(part),
    );
    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html).toContain('data-testid="formTitle"');
    expect(html).toContain('data-testid="claimCard"');
  });

  it('leaves the title without a testid by default', () => {
    const html = renderToStaticMarkup(
      <ClaimTypeCard badges={null} title="TITLE" description="DESCRIPTION" />,
    );

    expect(html).toContain('TITLE');
    expect(html).not.toContain('formTitle');
  });
});
