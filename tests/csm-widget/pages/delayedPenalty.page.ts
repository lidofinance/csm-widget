import { Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { TxModal } from './elements/common/element.txProgressModal';
import { DelayedPenaltyCancelPage } from './tabs/delayedPenalty/cancel.page';
import { DelayedPenaltyReportPage } from './tabs/delayedPenalty/report.page';

export class DelayedPenaltyPage extends BasePage {
  report: DelayedPenaltyReportPage;
  cancel: DelayedPenaltyCancelPage;
  txModal: TxModal;

  constructor(public page: Page) {
    super(page);
    this.report = new DelayedPenaltyReportPage(page);
    this.cancel = new DelayedPenaltyCancelPage(page);
    this.txModal = new TxModal(page);
  }
}
