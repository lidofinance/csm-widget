import { renderToStaticMarkup } from 'react-dom/server';

// the shared/form-page barrel pulls wagmi through SubmitButton; only FormCard is needed
jest.mock('shared/form-page', () =>
  jest.requireActual('shared/form-page/form-card'),
);

// eslint-disable-next-line import/first
import {
  MetadataReadOnlyCard,
  MetadataRestrictedNotice,
} from './metadata-read-only-card';

describe('MetadataReadOnlyCard', () => {
  it('shows the current values in disabled inputs under the card title', () => {
    const html = renderToStaticMarkup(
      <MetadataReadOnlyCard
        name="Simply Staking"
        description="Solo staker since 2020"
        notice={<span data-testid="someNotice">notice</span>}
      />,
    );

    expect(html).toContain('data-testid="metadataForm"');
    expect(html).toContain('Node Operator name');
    expect(html).toContain('Name');
    expect(html).toContain('Description');
    expect(html).toMatch(/<input[^>]*value="Simply Staking"/);
    expect(html).toMatch(/<input[^>]*value="Solo staker since 2020"/);
    expect(html.match(/<input[^>]*disabled=""/g)).toHaveLength(2);
    expect(html).toContain('data-testid="someNotice"');
  });

  it('never renders a form or a button', () => {
    const html = renderToStaticMarkup(
      <MetadataReadOnlyCard name="A" description="B" notice={null} />,
    );

    expect(html).not.toContain('<form');
    expect(html).not.toContain('<button');
  });

  it('shows a dash for empty values', () => {
    const html = renderToStaticMarkup(
      <MetadataReadOnlyCard name="" notice={null} />,
    );

    expect(html.match(/<input[^>]*value="—"/g)).toHaveLength(2);
  });
});

describe('MetadataRestrictedNotice', () => {
  it('renders the Figma headline and the single-sentence body', () => {
    const html = renderToStaticMarkup(<MetadataRestrictedNotice />);

    expect(html).toContain('Editing is currently disabled.');
    expect(html).toContain('Contact the NOM team or CMC for assistance');
    expect(html).not.toContain('assistance.');
  });
});
