import { renderToStaticMarkup } from 'react-dom/server';
import { CuratedOperatorStepHeading } from './step-heading';

describe('CuratedOperatorStepHeading', () => {
  it('renders the title as h1 and the description with e2e testids', () => {
    const html = renderToStaticMarkup(<CuratedOperatorStepHeading step={0} />);

    expect(html).toMatch(
      /<h1[^>]*data-testid="stepTitle"[^>]*>Select Sub-Node Operator Type<\/h1>/,
    );
    expect(html).toMatch(
      /data-testid="stepDescription"[^>]*>Choose the type you want to create now\./,
    );
  });

  it('renders the role facts after the description on the addresses step', () => {
    const html = renderToStaticMarkup(<CuratedOperatorStepHeading step={1} />);
    const description = html.indexOf('mainly used to receive rewards');
    const note = html.indexOf(
      'Rewards Address cannot reset the Manager Address. Manager Address can change the Rewards Address.',
    );

    expect(description).toBeGreaterThan(-1);
    expect(note).toBeGreaterThan(description);
  });

  it('omits the description when the step has none', () => {
    const html = renderToStaticMarkup(<CuratedOperatorStepHeading step={3} />);

    expect(html).toContain('Confirm Node Operator creation');
    expect(html).not.toContain('stepDescription');
  });
});
