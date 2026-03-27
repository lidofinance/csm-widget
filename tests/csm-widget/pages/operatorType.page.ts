import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { TxModal } from './elements/common/element.txProgressModal';
import { ApplicationForm } from './tabs/operatorType/applicationForm.page';

export class OperatorTypePage extends BasePage {
  applicationForm: ApplicationForm;
  txModal: TxModal;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    super(page);
    this.applicationForm = new ApplicationForm(page, walletPage);
    this.txModal = new TxModal(page);
  }
}
