import { renderToStaticMarkup } from 'react-dom/server';
import {
  TransactionModalContent,
  TxStageStatus,
} from './transaction-modal-content';

const renderStage = (status: TxStageStatus = 'loading') =>
  renderToStaticMarkup(
    <TransactionModalContent
      status={status}
      title="Stage title"
      description="Stage description"
      footerHint="Stage hint"
      footer={<button type="button">Stage action</button>}
    />,
  );

describe('TransactionModalContent', () => {
  it('renders TxStatus as a polite status region', () => {
    const html = renderStage();
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it('keeps the e2e testids', () => {
    const html = renderStage();
    ['txStage', 'title', 'description', 'footerHint', 'footer'].forEach((id) =>
      expect(html).toContain(`data-testid="${id}"`),
    );
  });

  it('places the footer before the hint', () => {
    const html = renderStage();
    expect(html.indexOf('data-testid="footer"')).toBeLessThan(
      html.indexOf('data-testid="footerHint"'),
    );
  });

  it('draws the TxStatus glyph for the status', () => {
    expect(renderStage('error')).toContain('circleError');
  });
});
