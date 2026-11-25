import { DataListRow } from '@lidofinance/lido-app-ui';
import { renderToStaticMarkup } from 'react-dom/server';
import { SubmitAside } from './submit-aside';

it('renders confirm, rows and CTA in order', () => {
  const html = renderToStaticMarkup(
    <SubmitAside
      confirm={<i>CONFIRM</i>}
      rows={<DataListRow label="Number of keys" value="1" />}
    >
      <button type="submit">CTA</button>
    </SubmitAside>,
  );
  const order = ['CONFIRM', 'Number of keys', 'CTA'].map((s) =>
    html.indexOf(s),
  );
  expect(order.every((index) => index >= 0)).toBe(true);
  expect([...order].sort((a, b) => a - b)).toEqual(order);
});

it('omits the rows list when there are no rows', () => {
  const html = renderToStaticMarkup(
    <SubmitAside>
      <button type="submit">CTA</button>
    </SubmitAside>,
  );
  expect(html).not.toContain('DataList');
  expect(html).toContain('CTA');
});
