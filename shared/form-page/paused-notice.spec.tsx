import { renderToStaticMarkup } from 'react-dom/server';
import { PausedNotice } from './paused-notice';

let mockMeta: { shortName: string } | undefined = { shortName: 'CM' };

vi.mock('shared/hooks/use-module-meta', () => ({
  useModuleMeta: () => mockMeta,
}));

beforeEach(() => {
  mockMeta = { shortName: 'CM' };
});

describe('PausedNotice', () => {
  it('names the active module and keeps the keys-upload copy by default', () => {
    const html = renderToStaticMarkup(<PausedNotice />);

    expect(html).toContain('data-testid="pausedNotice"');
    expect(html).toContain('>CM is paused<');
    expect(html).toContain(
      'This means that Node Operator creation and keys upload is not possible',
    );
  });

  it('falls back to "Module" without an active module', () => {
    mockMeta = undefined;
    expect(renderToStaticMarkup(<PausedNotice />)).toContain(
      '>Module is paused<',
    );
  });

  it('takes headline, copy and testid overrides', () => {
    const html = renderToStaticMarkup(
      <PausedNotice
        headline="CM Accounting is paused"
        data-testid="accountingPausedNotice"
      >
        This means that claim and add bond is currently not possible
      </PausedNotice>,
    );

    expect(html).toContain('data-testid="accountingPausedNotice"');
    expect(html).toContain('>CM Accounting is paused<');
    expect(html).toContain(
      'This means that claim and add bond is currently not possible',
    );
    expect(html).not.toContain('keys upload');
  });
});
