import { renderToStaticMarkup } from 'react-dom/server';

// the shared/form-page barrel pulls wagmi through SubmitButton; only FormCard is needed
jest.mock('shared/form-page', () =>
  jest.requireActual('shared/form-page/form-card'),
);

// eslint-disable-next-line import/first
import { TopUpCard, TopUpLockedCard } from './top-up-card';

describe('TopUpLockedCard', () => {
  it('renders a disabled, unchecked switch with the disabled copy', () => {
    const html = renderToStaticMarkup(<TopUpLockedCard />);

    expect(html).toContain('Top-ups');
    expect(html).toContain('Top-up are currently disabled');
    expect(html).toContain(
      'Your Node Operator is not eligible for receiving top-up deposits. Only the CMC can enable top-ups.',
    );
    expect(html).toMatch(/<input[^>]*role="switch"/);
    expect(html).toMatch(/<input[^>]*disabled=""/);
    expect(html).not.toMatch(/<input[^>]*checked=""/);
  });

  it('never renders a form', () => {
    expect(renderToStaticMarkup(<TopUpLockedCard />)).not.toContain('<form');
  });
});

describe('TopUpCard', () => {
  it('renders the switch slot above the description', () => {
    const html = renderToStaticMarkup(
      <TopUpCard enabled>
        <span data-testid="switchSlot" />
      </TopUpCard>,
    );

    const slot = html.indexOf('data-testid="switchSlot"');
    const description = html.indexOf(
      'Your Node Operator is eligible for receiving top-up deposits',
    );

    expect(slot).toBeGreaterThan(-1);
    expect(description).toBeGreaterThan(slot);
  });
});
