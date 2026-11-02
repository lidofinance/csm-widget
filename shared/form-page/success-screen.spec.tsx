import { renderToStaticMarkup } from 'react-dom/server';
import { SuccessScreen } from './success-screen';

it('renders all slots in order', () => {
  const html = renderToStaticMarkup(
    <SuccessScreen
      title="Congratulations!"
      description="DESCRIPTION"
      notice={<i>NOTICE</i>}
      stats={<i>STATS</i>}
      next={<i>NEXT</i>}
      actions={<i>ACTIONS</i>}
    />,
  );
  const order = [
    'Congratulations!',
    'DESCRIPTION',
    'NOTICE',
    'STATS',
    'NEXT',
    'ACTIONS',
  ].map((s) => html.indexOf(s));
  expect(order.every((index) => index >= 0)).toBe(true);
  expect([...order].sort((a, b) => a - b)).toEqual(order);
  expect(html).toContain('data-testid="successScreen"');
  expect(html).toContain('data-testid="successActions"');
});

it('skips empty optional sections and the empty actions row', () => {
  const html = renderToStaticMarkup(
    <SuccessScreen
      title="Congratulations!"
      description="DESCRIPTION"
      actions={null}
      data-testid="createSuccess"
    />,
  );
  expect(html).toContain('data-testid="createSuccess"');
  expect(html).not.toContain('successActions');
  expect(html).not.toContain('NEXT');
});
