import { SegmentedControl } from '@lidofinance/lido-app-ui';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  getDepositDataState,
  getDepositDataTabItems,
} from './deposit-data-state';

const parseError = { type: 'VALIDATE', message: 'Invalid deposit data' };

describe('getDepositDataState', () => {
  it('is clean without keys or errors', () => {
    expect(getDepositDataState({ keysCount: 0 })).toEqual({
      hasKeys: false,
      errorsCount: 0,
      highlight: false,
      message: undefined,
    });
  });

  it('highlights and carries the raw input error message', () => {
    expect(getDepositDataState({ keysCount: 0, rawError: parseError })).toEqual(
      {
        hasKeys: false,
        errorsCount: 0,
        highlight: true,
        message: 'Invalid deposit data',
      },
    );
  });

  it('prefers the raw input error over the parsed keys error', () => {
    expect(
      getDepositDataState({
        keysCount: 2,
        rawError: parseError,
        depositDataError: { type: 'VALIDATE', message: 'Too many keys' },
      }).message,
    ).toBe('Invalid deposit data');
  });

  it('highlights without a message for an empty message', () => {
    expect(
      getDepositDataState({
        keysCount: 0,
        rawError: { type: 'VALIDATE', message: '' },
      }),
    ).toMatchObject({ highlight: true, message: undefined });
  });

  it('ignores error types other than VALIDATE', () => {
    expect(
      getDepositDataState({
        keysCount: 1,
        rawError: { type: 'REMOVE_KEY_ERROR', message: 'Failed to remove key' },
      }),
    ).toMatchObject({ highlight: false, message: undefined });
  });

  it('counts keys with per-key errors only while keys exist', () => {
    const depositDataError = {
      type: 'VALIDATE',
      message: 'Invalid deposit data',
      types: { 0: ['pubkey is duplicated'], 2: ['amount is not 32 ETH'] },
    };

    expect(
      getDepositDataState({ keysCount: 3, depositDataError }).errorsCount,
    ).toBe(2);
    expect(
      getDepositDataState({ keysCount: 0, depositDataError }).errorsCount,
    ).toBe(0);
  });
});

const renderTabs = (hasKeys: boolean, errorsCount: number) =>
  renderToStaticMarkup(
    <SegmentedControl
      items={getDepositDataTabItems({ hasKeys, errorsCount })}
      value="json"
      onChange={() => undefined}
    />,
  );

const tab = (html: string, name: string) =>
  html.match(
    new RegExp(`<button[^>]*data-testid="tab-button-${name}"[^>]*>`),
  )?.[0] ?? '';

describe('getDepositDataTabItems', () => {
  it('keeps the e2e tab testids', () => {
    const html = renderTabs(true, 0);

    expect(tab(html, 'JSON')).toContain('role="tab"');
    expect(tab(html, 'Parsed')).toContain('role="tab"');
    expect(tab(html, 'Parameters')).toContain('role="tab"');
  });

  it('disables Parsed and Parameters without keys', () => {
    const html = renderTabs(false, 0);

    expect(tab(html, 'JSON')).not.toContain('disabled');
    expect(tab(html, 'Parsed')).toContain('disabled=""');
    expect(tab(html, 'Parameters')).toContain('disabled=""');
  });

  it('shows the errors counter on Parsed only when keys have errors', () => {
    expect(renderTabs(true, 0)).not.toContain('depositDataErrorsCounter');
    expect(renderTabs(true, 3)).toMatch(
      /data-testid="depositDataErrorsCounter"[^>]*>3</,
    );
  });
});
