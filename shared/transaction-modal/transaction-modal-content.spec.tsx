import { renderToStaticMarkup } from 'react-dom/server';
import { themeLight } from '@lidofinance/lido-ui';
import { ThemeProvider } from 'styled-components';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import {
  TransactionModalContent,
  TxStageStatus,
} from './transaction-modal-content';

const renderStage = (ui: FormUi, status: TxStageStatus = 'loading') =>
  renderToStaticMarkup(
    <ThemeProvider theme={themeLight}>
      <FormUiProvider value={ui}>
        <TransactionModalContent
          status={status}
          icon={<i>legacy-icon</i>}
          title="Stage title"
          description="Stage description"
          footerHint="Stage hint"
          footer={<button type="button">Stage action</button>}
        />
      </FormUiProvider>
    </ThemeProvider>,
  );

describe('TransactionModalContent', () => {
  describe('app', () => {
    it('renders TxStatus as a polite status region', () => {
      const html = renderStage('app');
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-live="polite"');
    });

    it('keeps the e2e testids', () => {
      const html = renderStage('app');
      ['txStage', 'title', 'description', 'footerHint', 'footer'].forEach(
        (id) => expect(html).toContain(`data-testid="${id}"`),
      );
    });

    it('places the footer before the hint', () => {
      const html = renderStage('app');
      expect(html.indexOf('data-testid="footer"')).toBeLessThan(
        html.indexOf('data-testid="footerHint"'),
      );
    });

    it('draws the TxStatus glyph for the status instead of the icon', () => {
      const html = renderStage('app', 'error');
      expect(html).not.toContain('legacy-icon');
      expect(html).toContain('circleError');
    });
  });

  describe('legacy', () => {
    it('renders the icon and testids without a status region', () => {
      const html = renderStage('legacy');
      expect(html).toContain('legacy-icon');
      expect(html).toContain('data-testid="txStage"');
      expect(html).toContain('data-testid="footerHint"');
      expect(html).not.toContain('role="status"');
    });
  });
});
