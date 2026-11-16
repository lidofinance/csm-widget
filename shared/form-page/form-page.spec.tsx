import { renderToStaticMarkup } from 'react-dom/server';
import { FormPage } from './form-page';

const renderPage = (done?: boolean) =>
  renderToStaticMarkup(
    <FormPage
      steps={<i>STEPS</i>}
      notices={<i>NOTICES</i>}
      below={<i>BELOW</i>}
      faq={<i>FAQ</i>}
      done={done}
    >
      <i>BODY</i>
    </FormPage>,
  );

it('renders slots in order: steps, notices, body, below, faq', () => {
  const html = renderPage();
  const order = ['STEPS', 'NOTICES', 'BODY', 'BELOW', 'FAQ'].map((s) =>
    html.indexOf(s),
  );
  expect(order.every((index) => index >= 0)).toBe(true);
  expect([...order].sort((a, b) => a - b)).toEqual(order);
});

it('hides notices and below when done', () => {
  const html = renderPage(true);
  expect(html).toContain('STEPS');
  expect(html).toContain('BODY');
  expect(html).toContain('FAQ');
  expect(html).not.toContain('NOTICES');
  expect(html).not.toContain('BELOW');
});
