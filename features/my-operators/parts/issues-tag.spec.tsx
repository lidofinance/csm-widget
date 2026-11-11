import { renderToStaticMarkup } from 'react-dom/server';
import { IssuesTag } from './issues-tag';

const render = (count: number | undefined) =>
  renderToStaticMarkup(<IssuesTag count={count} dataTestId="issuesTag" />);

describe('IssuesTag', () => {
  it('renders nothing while undefined', () => {
    expect(render(undefined)).toBe('');
  });

  it('renders the success tag at zero', () => {
    expect(render(0)).toContain('No issues');
  });

  it('uses the singular for one issue', () => {
    const html = render(1);

    expect(html).toContain('>1 issue<');
    expect(html).not.toContain('1 issues');
  });

  it('uses the plural for several issues', () => {
    expect(render(2)).toContain('2 issues');
  });

  it('keeps the test id', () => {
    expect(render(2)).toContain('data-testid="issuesTag"');
  });
});
