import { renderToStaticMarkup } from 'react-dom/server';
import { WizardStepper } from './wizard-stepper';

vi.mock('@lidofinance/lido-app-ui', async () => ({
  ...(await vi.importActual('@lidofinance/lido-app-ui')),
  Steps: ({
    steps,
    current,
  }: {
    steps: { label: string }[];
    current: number;
  }) => <ol data-current={current}>{steps.map((s) => s.label).join('|')}</ol>,
}));

const STEPS = [
  'Acknowledgement',
  'Choose operator type',
  'Upload keys',
  'Create Node Operator',
];

it('passes labels and the current index to Steps', () => {
  const html = renderToStaticMarkup(
    <WizardStepper steps={STEPS} current={2} />,
  );
  expect(html).toContain('data-current="2"');
  expect(html).toContain(STEPS.join('|'));
});

it('renders the hidden step track text', () => {
  const html = renderToStaticMarkup(
    <WizardStepper steps={STEPS} current={0} />,
  );
  expect(html).toMatch(/data-testid="stepTrackText"[^>]*>Step 1 of 4</);
});

it('marks every step done when done', () => {
  const html = renderToStaticMarkup(
    <WizardStepper steps={STEPS} current={2} done />,
  );
  expect(html).toContain('data-current="4"');
  expect(html).toContain('Step 4 of 4');
});
