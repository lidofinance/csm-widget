import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { renderToStaticMarkup } from 'react-dom/server';
import { KeyStatusTag } from 'shared/hook-form/fields/key-status-tag';
import { HUB_STATUS_TITLES } from './hub-status-titles';

const render = (status: KEY_STATUS) =>
  renderToStaticMarkup(
    <KeyStatusTag status={status} titles={HUB_STATUS_TITLES} />,
  );

describe('KeyStatusTag with hub titles', () => {
  it.each([
    [KEY_STATUS.ACTIVATION_PENDING, 'Pending activation'],
    [KEY_STATUS.WITHDRAWAL_PENDING, 'Exited'],
    [KEY_STATUS.INVALID, 'Invalid signature'],
    [KEY_STATUS.DUPLICATED, 'Duplicated'],
  ])('%s renders %s', (status, title) => {
    expect(render(status)).toContain(`>${title}<`);
  });
});
