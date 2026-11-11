import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { renderToStaticMarkup } from 'react-dom/server';
import { getKeyStatusTagVariant, KeyStatusTag } from './key-status-tag';

describe('getKeyStatusTagVariant', () => {
  it.each([
    [KEY_STATUS.ACTIVE, 'success'],
    [KEY_STATUS.ACTIVATION_PENDING, 'warning'],
    [KEY_STATUS.DEPOSITABLE, 'warning'],
    [KEY_STATUS.DUPLICATED, 'error'],
    [KEY_STATUS.NON_QUEUED, 'warning'],
    [KEY_STATUS.WITHDRAWN, 'neutral'],
    [KEY_STATUS.EJECTABLE, undefined],
    [KEY_STATUS.WITH_STRIKES, undefined],
  ])('%s -> %s', (status, expected) => {
    expect(getKeyStatusTagVariant(status)).toBe(expected);
  });
});

describe('KeyStatusTag', () => {
  it('renders the legacy status title in a text-only tag', () => {
    const html = renderToStaticMarkup(
      <KeyStatusTag status={KEY_STATUS.DUPLICATED} />,
    );

    expect(html).toContain('Tag-module_error');
    expect(html).toContain('>Duplicated</span>');
    expect(html).not.toContain('<svg');
  });

  it('renders a title override', () => {
    const html = renderToStaticMarkup(
      <KeyStatusTag
        status={KEY_STATUS.INVALID}
        titles={{ [KEY_STATUS.INVALID]: 'Invalid signature' }}
      />,
    );

    expect(html).toContain('>Invalid signature</span>');
  });

  it('renders nothing for a status without a tag', () => {
    expect(
      renderToStaticMarkup(<KeyStatusTag status={KEY_STATUS.EJECTABLE} />),
    ).toBe('');
  });
});
