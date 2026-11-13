import { renderToStaticMarkup } from 'react-dom/server';
import { FormCard } from './form-card';

describe('FormCard', () => {
  it('renders the title row before the children', () => {
    const html = renderToStaticMarkup(
      <FormCard
        title="Specify a new Rewards claimer address"
        description="DESCRIPTION"
        action={<a href="#faq">FAQ</a>}
        data-testid="claimerForm"
      >
        <i>FIELD</i>
        <button type="submit">CTA</button>
      </FormCard>,
    );

    expect(html).toContain('data-testid="claimerForm"');
    expect(html).toContain('data-testid="formTitle"');
    expect(html).toContain('>Specify a new Rewards claimer address</p>');
    expect(html).toContain('DESCRIPTION');
    expect(html).toContain('<a href="#faq">FAQ</a>');
    expect(html.indexOf('formTitle')).toBeLessThan(html.indexOf('FIELD'));
    expect(html.indexOf('FIELD')).toBeLessThan(html.indexOf('CTA'));
  });

  it('renders the title tooltip trigger', () => {
    const html = renderToStaticMarkup(
      <FormCard title="TITLE" tooltip="TIP">
        <i>FIELD</i>
      </FormCard>,
    );

    expect(html).toContain('formTitleTooltip');
  });

  it('skips the title row without a title', () => {
    const html = renderToStaticMarkup(
      <FormCard>
        <i>FIELD</i>
      </FormCard>,
    );

    expect(html).not.toContain('formTitle');
    expect(html).toContain('<i>FIELD</i>');
  });
});
