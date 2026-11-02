import { renderToStaticMarkup } from 'react-dom/server';
import { StepIndicator } from './step-indicator';

const STEPS = [{ label: 'First' }, { label: 'Second' }, { label: 'Third' }];

const splitItems = (html: string) => html.split('<li').slice(1);

describe('StepIndicator', () => {
  it('renders an ordered list item per step with its label', () => {
    const html = renderToStaticMarkup(
      <StepIndicator steps={STEPS} current={1} />,
    );

    expect(html.startsWith('<ol')).toBe(true);
    expect(splitItems(html)).toHaveLength(3);
    expect(html).toContain('>First<');
    expect(html).toContain('>Second<');
    expect(html).toContain('>Third<');
  });

  it('marks only the current step with aria-current', () => {
    const items = splitItems(
      renderToStaticMarkup(<StepIndicator steps={STEPS} current={1} />),
    );

    expect(items[0]).not.toContain('aria-current');
    expect(items[1]).toContain('aria-current="step"');
    expect(items[2]).not.toContain('aria-current');
  });

  it('shows a check icon for done steps and numbers for the rest', () => {
    const items = splitItems(
      renderToStaticMarkup(<StepIndicator steps={STEPS} current={1} />),
    );

    expect(items[0]).toContain('<svg');
    expect(items[0]).not.toContain('>1<');
    expect(items[1]).not.toContain('<svg');
    expect(items[1]).toContain('>2<');
    expect(items[2]).toContain('>3<');
  });

  it('renders a hidden connector between steps only', () => {
    const items = splitItems(
      renderToStaticMarkup(<StepIndicator steps={STEPS} current={0} />),
    );

    expect(items[0]).toContain('aria-hidden="true"');
    expect(items[1]).toContain('aria-hidden="true"');
    expect(items[2]).not.toContain('aria-hidden="true"');
  });

  it('renders every step done when current is past the end', () => {
    const items = splitItems(
      renderToStaticMarkup(<StepIndicator steps={STEPS} current={3} />),
    );

    items.forEach((item) => {
      expect(item).toContain('<svg');
      expect(item).not.toContain('aria-current');
    });
  });

  it('forwards html attributes to the list', () => {
    const html = renderToStaticMarkup(
      <StepIndicator
        steps={STEPS}
        current={0}
        data-testid="stepper"
        aria-label="Progress"
      />,
    );

    expect(html).toMatch(/^<ol[^>]*data-testid="stepper"/);
    expect(html).toMatch(/^<ol[^>]*aria-label="Progress"/);
  });
});
